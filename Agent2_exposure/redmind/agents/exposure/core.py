import os
import json
import logging
from openai import OpenAI
from pydantic import ValidationError

from src.redmind.models.pipeline_state import PipelineState
from src.redmind.agents.exposure.models import ExposureSection
from src.redmind.agents.exposure.prompt import get_exposure_system_prompt

# Setup structured logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ExposureAgent")

class ExposureAgent:
    """
    Agent 2: Exposure Analysis Agent.
    Strictly passive reasoning engine. Consumes Evidence and Recon, outputs Exposure.
    """
    def __init__(self):
        self.api_key = os.getenv("FEATHERLESS_API_KEY")
        self.base_url = "https://api.aimlapi.com/v1"
        self.model = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
        
        if not self.api_key:
            logger.error("Initialization Failed: FEATHERLESS_API_KEY environment variable is required.")
            raise ValueError("FEATHERLESS_API_KEY environment variable is required.")
            
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)
        logger.info("ExposureAgent initialized successfully.")

    def _query_llm(self, messages: list, retry_count: int = 0) -> tuple[str, dict, float]:
        """Helper to query the LLM and return the raw string content, usage dict, and latency."""
        import time
        logger.info(f"Querying LLM (Model: {self.model}, Attempt: {retry_count + 1})")
        start_time = time.time()
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.2,
            max_tokens=8192,
            response_format={"type": "json_object"}
        )
        latency = time.time() - start_time
        
        usage = {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0
        }
        return response.choices[0].message.content, usage, latency

    def analyze(self, state: PipelineState) -> PipelineState:
        """
        Takes the global PipelineState, reads evidence and recon,
        and mutates ONLY the `exposure` section.
        """
        logger.info("Starting Exposure Analysis...")
        
        # 1. Validate Input
        if not state.recon:
            logger.error("Validation Error: No recon found in PipelineState.")
            raise ValueError("No recon found in PipelineState.")
            
        logger.info("Input validation passed. Recon data present.")

        # 2. Prepare Prompts
        system_prompt = get_exposure_system_prompt()
        
        # Serialize only the allowed inputs (Recon only)
        input_data = {
            "recon": state.recon.model_dump()
        }
        
        user_message = f"""
        Here is the Reconnaissance data.
        Return ONLY the valid JSON object for the "exposure" section matching your schema.
        Do not wrap in Markdown. ONLY the exposure JSON object.

        INPUT DATA:
        {json.dumps(input_data)}
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        # 3. Execution with Retry Logic
        raw_json_output = ""
        total_retries = 0
        try:
            raw_json_output, usage, latency = self._query_llm(messages)
            
            # Store metrics
            if "execution_metrics" not in state.scan_metadata:
                state.scan_metadata["execution_metrics"] = {}
            
            cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
            state.scan_metadata["execution_metrics"]["exposure"] = {
                "prompt_tokens": usage["prompt_tokens"],
                "completion_tokens": usage["completion_tokens"],
                "latency": latency,
                "cost": cost,
                "retries": total_retries
            }
            parsed_json = json.loads(raw_json_output)
            
            if "exposure" in parsed_json and isinstance(parsed_json["exposure"], dict):
                parsed_json = parsed_json["exposure"]
            elif "exposure_section" in parsed_json and isinstance(parsed_json["exposure_section"], dict):
                parsed_json = parsed_json["exposure_section"]
                
            validated_exposure = ExposureSection(**parsed_json)
            
            logger.info("LLM output successfully validated against ExposureSection schema on first attempt.")
            
        except (json.JSONDecodeError, ValidationError) as e:
            logger.warning(f"Validation failed on first attempt: {e}. Initiating retry...")
            
            # Formulate retry message
            retry_message = f"""
            Your previous output failed validation. You MUST return valid JSON matching the schema.
            Error details: {str(e)}
            
            Previous invalid output:
            {raw_json_output}
            
            Please correct the errors and output ONLY the valid JSON object.
            """
            messages.append({"role": "assistant", "content": raw_json_output})
            messages.append({"role": "user", "content": retry_message})
            
            try:
                total_retries = 1
                raw_json_output, retry_usage, retry_latency = self._query_llm(messages, retry_count=1)
                
                # Update metrics
                state.scan_metadata["execution_metrics"]["exposure"]["prompt_tokens"] += retry_usage["prompt_tokens"]
                state.scan_metadata["execution_metrics"]["exposure"]["completion_tokens"] += retry_usage["completion_tokens"]
                state.scan_metadata["execution_metrics"]["exposure"]["latency"] += retry_latency
                state.scan_metadata["execution_metrics"]["exposure"]["cost"] += (retry_usage["prompt_tokens"] * 0.00000015) + (retry_usage["completion_tokens"] * 0.0000006)
                state.scan_metadata["execution_metrics"]["exposure"]["retries"] = total_retries
                
                parsed_json = json.loads(raw_json_output)
                
                if "exposure" in parsed_json and isinstance(parsed_json["exposure"], dict):
                    parsed_json = parsed_json["exposure"]
                elif "exposure_section" in parsed_json and isinstance(parsed_json["exposure_section"], dict):
                    parsed_json = parsed_json["exposure_section"]
                    
                validated_exposure = ExposureSection(**parsed_json)
                logger.info("LLM output successfully validated on second attempt.")
                
            except (json.JSONDecodeError, ValidationError) as fatal_e:
                logger.error(f"Validation failed on retry. Returning structured error. Error: {fatal_e}")
                
                # We do NOT modify PipelineState on fatal failure. 
                # Instead, we could raise the error or return the state unmodified.
                # The user prompt: "If the second attempt fails: Return a structured error object. Do not modify the PipelineState."
                raise RuntimeError(f"ExposureAgent failed to generate valid ExposureSection after retry. Error: {fatal_e}")

        except Exception as e:
            logger.error(f"Unexpected error during analysis: {e}")
            raise e

        # 4. Mutate State
        state.exposure = validated_exposure
        logger.info("Exposure Analysis complete. PipelineState.exposure successfully populated.")
        
        return state
