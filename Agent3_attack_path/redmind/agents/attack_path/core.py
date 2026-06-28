import json
import logging
from pydantic import ValidationError

from src.redmind.models.pipeline_state import PipelineState
from src.redmind.agents.attack_path.models import AttackPathSection
from src.redmind.agents.attack_path.prompt import get_attack_path_system_prompt
from src.redmind.agents.attack_path.llm import LLMClient, FeatherlessClient

# Setup structured logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AttackPathAgent")

class AttackPathAgent:
    """
    Agent 3: Attack Path Analysis Agent.
    Pure reasoning engine. Consumes Evidence, Recon, and Exposure. Outputs Attack Paths.
    """
    def __init__(self, llm_client: LLMClient = None):
        self.llm_client = llm_client or FeatherlessClient()
        logger.info("AttackPathAgent initialized successfully.")

    def analyze(self, state: PipelineState) -> PipelineState:
        """
        Takes the global PipelineState, reads evidence, recon, and exposure,
        and mutates ONLY the `attack_paths` section.
        """
        logger.info("Starting Attack Path Analysis...")
        
        # 1. Validate Input
        if not state.recon:
            logger.error("Validation Error: No recon found in PipelineState.")
            raise ValueError("No recon found in PipelineState.")
        if not state.exposure:
            logger.error("Validation Error: No exposure found in PipelineState.")
            raise ValueError("No exposure found in PipelineState.")
            
        logger.info("Input validation passed. Recon and Exposure data present.")

        # 2. Prepare Prompts
        system_prompt = get_attack_path_system_prompt()
        
        # Serialize only the allowed inputs
        input_data = {
            "recon": state.recon.model_dump(),
            "exposure": state.exposure.model_dump()
        }
        
        user_message = f"""
        Here is the combined Reconnaissance and Exposure data.
        Return ONLY the valid JSON object for the "attack_paths" section matching your schema.
        Do not wrap in Markdown. ONLY the JSON object.

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
            raw_json_output, usage, latency = self.llm_client.query(messages)
            
            # Store metrics
            if "execution_metrics" not in state.scan_metadata:
                state.scan_metadata["execution_metrics"] = {}
            
            cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
            state.scan_metadata["execution_metrics"]["attack_paths"] = {
                "prompt_tokens": usage["prompt_tokens"],
                "completion_tokens": usage["completion_tokens"],
                "latency": latency,
                "cost": cost,
                "retries": total_retries
            }
            
            parsed_json = json.loads(raw_json_output)
            
            if "attack_paths" in parsed_json and isinstance(parsed_json["attack_paths"], dict):
                parsed_json = parsed_json["attack_paths"]
            elif "attack_path_section" in parsed_json and isinstance(parsed_json["attack_path_section"], dict):
                parsed_json = parsed_json["attack_path_section"]
                
            validated_attack_path = AttackPathSection(**parsed_json)
            
            logger.info("LLM output successfully validated against AttackPathSection schema on first attempt.")
            
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
                raw_json_output, retry_usage, retry_latency = self.llm_client.query(messages, retry_count=1)
                
                # Update metrics
                state.scan_metadata["execution_metrics"]["attack_paths"]["prompt_tokens"] += retry_usage["prompt_tokens"]
                state.scan_metadata["execution_metrics"]["attack_paths"]["completion_tokens"] += retry_usage["completion_tokens"]
                state.scan_metadata["execution_metrics"]["attack_paths"]["latency"] += retry_latency
                state.scan_metadata["execution_metrics"]["attack_paths"]["cost"] += (retry_usage["prompt_tokens"] * 0.00000015) + (retry_usage["completion_tokens"] * 0.0000006)
                state.scan_metadata["execution_metrics"]["attack_paths"]["retries"] = total_retries
                
                parsed_json = json.loads(raw_json_output)
                
                if "attack_paths" in parsed_json and isinstance(parsed_json["attack_paths"], dict):
                    parsed_json = parsed_json["attack_paths"]
                elif "attack_path_section" in parsed_json and isinstance(parsed_json["attack_path_section"], dict):
                    parsed_json = parsed_json["attack_path_section"]
                    
                validated_attack_path = AttackPathSection(**parsed_json)
                logger.info("LLM output successfully validated on second attempt.")
                
            except (json.JSONDecodeError, ValidationError) as fatal_e:
                logger.error(f"Validation failed on retry. Returning structured error. Error: {fatal_e}")
                raise RuntimeError(f"AttackPathAgent failed to generate valid AttackPathSection after retry. Error: {fatal_e}")

        except Exception as e:
            logger.error(f"Unexpected error during analysis: {e}")
            raise e

        # 4. Mutate State
        state.attack_paths = validated_attack_path
        logger.info("Attack Path Analysis complete. PipelineState.attack_paths successfully populated.")
        
        return state
