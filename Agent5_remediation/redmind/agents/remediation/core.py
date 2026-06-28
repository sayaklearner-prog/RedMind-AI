import json
import logging
from typing import Optional
from pydantic import ValidationError

from src.redmind.models.pipeline_state import PipelineState
from src.redmind.agents.remediation.models import RemediationSection
from src.redmind.agents.remediation.prompt import RemediationPromptBuilder
from src.redmind.agents.remediation.llm import LLMClient

logger = logging.getLogger(__name__)

class RemediationPlanningAgent:
    """
    Agent 5: Remediation Planning Agent.
    Pure reasoning agent that transforms validated security risks into remediation plans.
    """
    def __init__(self):
        self.prompt_builder = RemediationPromptBuilder()
        self.llm = LLMClient()
        
    def _validate_inputs(self, state: PipelineState) -> bool:
        if not state.recon:
            logger.error("Validation failed: Missing recon section")
            return False
        if not state.exposure:
            logger.error("Validation failed: Missing exposure section")
            return False
        if not state.attack_paths:
            logger.error("Validation failed: Missing attack_paths section")
            return False
        if not state.risk:
            logger.error("Validation failed: Missing risk section")
            return False
        return True

    async def execute(self, state: PipelineState) -> PipelineState:
        logger.info("Initializing Agent 5 (Remediation Planning)")
        
        # 1. Validate Inputs
        logger.info("Validating inputs")
        if not self._validate_inputs(state):
            logger.error("Failed input validation. Leaving PipelineState unchanged.")
            return state
            
        # 2. Load Prompt
        logger.info("Loading master prompt")
        system_prompt = self.prompt_builder.build_system_prompt()
        
        # 3. Construct Prompt
        logger.info("Constructing user prompt from PipelineState")
        user_prompt = self.prompt_builder.build_user_prompt(state)
        
        # 4. LLM Invocation and 5. Pydantic Validation (with retry)
        max_retries = 1
        for attempt in range(max_retries + 1):
            try:
                logger.info(f"Invoking LLM (Attempt {attempt + 1}/{max_retries + 1})")
                total_retries = attempt
                json_response, usage, latency = await self.llm.generate_structured_json(system_prompt, user_prompt)
                
                # Store metrics
                if "execution_metrics" not in state.scan_metadata:
                    state.scan_metadata["execution_metrics"] = {}
                
                cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
                if "remediation" not in state.scan_metadata["execution_metrics"]:
                    state.scan_metadata["execution_metrics"]["remediation"] = {
                        "prompt_tokens": 0, "completion_tokens": 0, "latency": 0.0, "cost": 0.0, "retries": 0
                    }
                
                state.scan_metadata["execution_metrics"]["remediation"]["prompt_tokens"] += usage["prompt_tokens"]
                state.scan_metadata["execution_metrics"]["remediation"]["completion_tokens"] += usage["completion_tokens"]
                state.scan_metadata["execution_metrics"]["remediation"]["latency"] += latency
                state.scan_metadata["execution_metrics"]["remediation"]["cost"] += cost
                state.scan_metadata["execution_metrics"]["remediation"]["retries"] = total_retries
                
                logger.info("Validating JSON output against RemediationSection model")
                # Parse JSON and validate using Pydantic v2
                parsed_data = json.loads(json_response)
                
                if "remediation" in parsed_data and isinstance(parsed_data["remediation"], dict):
                    parsed_data = parsed_data["remediation"]
                elif "remediation_section" in parsed_data and isinstance(parsed_data["remediation_section"], dict):
                    parsed_data = parsed_data["remediation_section"]
                    
                remediation_section = RemediationSection.model_validate(parsed_data)
                
                # 6. Update PipelineState.remediation
                logger.info("Validation successful. Updating PipelineState.remediation.")
                state.remediation = remediation_section
                
                # 7. Successful completion
                logger.info("Agent 5 completed successfully.")
                break
                
            except (json.JSONDecodeError, ValidationError) as e:
                logger.warning(f"Validation failed: {str(e)}")
                if attempt == max_retries:
                    logger.error("Max retries reached. Returning structured validation errors. PipelineState unchanged.")
                else:
                    logger.info("Retrying...")
            except Exception as e:
                logger.error(f"Unexpected error during LLM invocation: {str(e)}")
                break
                    
        # 8. Return updated PipelineState
        return state
