import json
import logging
from typing import Optional
from pydantic import ValidationError

from src.redmind.models.pipeline_state import PipelineState
from src.redmind.agents.risk.models import RiskSection
from src.redmind.agents.risk.prompt import get_risk_system_prompt
from src.redmind.agents.risk.llm import LLMProvider, FeatherlessLLM

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("RiskAgent")

class RiskAssessmentAgent:
    """
    Agent 4: Risk Assessment Agent.
    Strictly passive reasoning engine. Consumes Evidence, Recon, Exposure, and Attack Paths.
    Outputs the RiskSection.
    """
    def __init__(self, llm_provider: Optional[LLMProvider] = None):
        self.llm = llm_provider or FeatherlessLLM()
        logger.info("RiskAssessmentAgent initialized successfully.")

    def analyze(self, state: PipelineState) -> PipelineState:
        """
        Takes the global PipelineState, reads required sections,
        and mutates ONLY the `risk` section.
        """
        logger.info("Starting Risk Assessment Analysis...")
        
        # 1. Validate Input
        missing_sections = []
        if not state.recon:
            missing_sections.append("recon")
        if not state.exposure:
            missing_sections.append("exposure")
        if not state.attack_paths:
            missing_sections.append("attack_paths")
            
        if missing_sections:
            error_msg = f"Validation Error: Missing required PipelineState sections: {', '.join(missing_sections)}"
            logger.error(error_msg)
            raise ValueError(error_msg)
            
        logger.info("Input validation passed. Required intelligence sections present.")

        # 2. Prepare Prompts
        system_prompt = get_risk_system_prompt()
        
        input_data = {
            "recon": state.recon.model_dump(),
            "exposure": state.exposure.model_dump(),
            "attack_paths": state.attack_paths.model_dump()
        }
        
        user_message = f"""
        Here is the combined Reconnaissance, Exposure, and Attack Path data.
        Return ONLY the valid JSON object for the "risk" section matching your schema.
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
            raw_json_output, usage, latency = self.llm.query_json(messages)
            
            # Store metrics
            if "execution_metrics" not in state.scan_metadata:
                state.scan_metadata["execution_metrics"] = {}
            
            cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
            state.scan_metadata["execution_metrics"]["risk"] = {
                "prompt_tokens": usage["prompt_tokens"],
                "completion_tokens": usage["completion_tokens"],
                "latency": latency,
                "cost": cost,
                "retries": total_retries
            }
            
            parsed_json = json.loads(raw_json_output)
            
            # Handle potential wrapping
            if "risk" in parsed_json and isinstance(parsed_json["risk"], dict):
                parsed_json = parsed_json["risk"]
            elif "risk_section" in parsed_json and isinstance(parsed_json["risk_section"], dict):
                parsed_json = parsed_json["risk_section"]
                
            validated_risk = RiskSection(**parsed_json)
            
            logger.info("LLM output successfully validated against RiskSection schema on first attempt.")
            
        except (json.JSONDecodeError, ValidationError) as e:
            logger.warning(f"Validation failed on first attempt: {e}. Initiating retry...")
            
            retry_message = f"""
            Your previous output failed validation. You MUST return valid JSON matching the RiskSection schema.
            Error details: {str(e)}
            
            Previous invalid output:
            {raw_json_output}
            
            Please correct the errors and output ONLY the valid JSON object.
            """
            messages.append({"role": "assistant", "content": raw_json_output})
            messages.append({"role": "user", "content": retry_message})
            
            try:
                total_retries = 1
                raw_json_output, retry_usage, retry_latency = self.llm.query_json(messages, retry_count=1)
                
                # Update metrics
                state.scan_metadata["execution_metrics"]["risk"]["prompt_tokens"] += retry_usage["prompt_tokens"]
                state.scan_metadata["execution_metrics"]["risk"]["completion_tokens"] += retry_usage["completion_tokens"]
                state.scan_metadata["execution_metrics"]["risk"]["latency"] += retry_latency
                state.scan_metadata["execution_metrics"]["risk"]["cost"] += (retry_usage["prompt_tokens"] * 0.00000015) + (retry_usage["completion_tokens"] * 0.0000006)
                state.scan_metadata["execution_metrics"]["risk"]["retries"] = total_retries
                
                parsed_json = json.loads(raw_json_output)
                
                if "risk" in parsed_json and isinstance(parsed_json["risk"], dict):
                    parsed_json = parsed_json["risk"]
                elif "risk_section" in parsed_json and isinstance(parsed_json["risk_section"], dict):
                    parsed_json = parsed_json["risk_section"]
                    
                validated_risk = RiskSection(**parsed_json)
                logger.info("LLM output successfully validated on second attempt.")
                
            except (json.JSONDecodeError, ValidationError) as fatal_e:
                logger.error(f"Validation failed on retry. Returning structured error. Error: {fatal_e}")
                raise RuntimeError(f"RiskAssessmentAgent failed to generate valid RiskSection after retry. Error: {fatal_e}")

        except Exception as e:
            logger.error(f"Unexpected error during risk assessment: {e}")
            raise e

        # 4. Mutate State
        state.risk = validated_risk
        logger.info("Risk Assessment Analysis complete. PipelineState.risk successfully populated.")
        
        return state
