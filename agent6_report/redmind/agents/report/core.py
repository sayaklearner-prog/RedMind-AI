import json
import logging
from pydantic import ValidationError
from typing import Dict, Any

from src.redmind.models.pipeline_state import PipelineState
from src.redmind.agents.report.models import ReportSection
from src.redmind.agents.report.llm import LLMProvider
from src.redmind.agents.report.prompt import ReportPromptBuilder

logger = logging.getLogger("ReportGenerationAgent")

class ReportGenerationAgent:
    """
    Agent 6: Report Generation Agent
    Strictly follows the PipelineState pure-reasoning architecture.
    It takes validated data from previous agents and generates presentation-ready reports.
    """
    def __init__(self, llm_provider: LLMProvider = None):
        self.llm = llm_provider or LLMProvider()
        self.prompt_builder = ReportPromptBuilder()

    def _validate_inputs(self, state: PipelineState) -> bool:
        """
        Ensures all required upstream intelligence is present.
        Agent 6 is the final layer and requires ALL sections.
        """
        logger.info("Validating inputs for Report Generation...")
        missing_sections = []
        if not state.recon: missing_sections.append("recon")
        if not state.exposure: missing_sections.append("exposure")
        if not state.attack_paths: missing_sections.append("attack_paths")
        if not state.risk: missing_sections.append("risk")
        if not state.remediation: missing_sections.append("remediation")
        
        if missing_sections:
            logger.error(f"Validation Error: Missing required PipelineState sections: {', '.join(missing_sections)}")
            return False
            
        logger.info("Input validation passed.")
        return True

    async def execute(self, state: PipelineState) -> PipelineState:
        """
        Main execution loop for Agent 6.
        """
        logger.info("--- Starting Report Generation Agent (Agent 6) ---")
        
        # 1. Validate PipelineState
        if not self._validate_inputs(state):
            logger.error("Failed input validation. Leaving PipelineState unchanged.")
            # Return validation errors in report section or just raise. 
            # Following the pattern, we leave state unchanged if fatal missing dependencies.
            return state

        # 2. Build Prompts
        logger.info("Constructing prompts from PipelineState...")
        system_prompt = self.prompt_builder.build_system_prompt()
        user_prompt = self.prompt_builder.build_user_prompt(state)

        # 3. Invocation loop with exactly 1 retry
        max_retries = 1
        for attempt in range(max_retries + 1):
            try:
                # 4. Invoke LLM
                logger.info(f"Invoking LLM (Attempt {attempt + 1}/{max_retries + 1})")
                total_retries = attempt
                response_text, usage, latency = await self.llm.generate_json(system_prompt, user_prompt)
                
                # Store metrics
                if "execution_metrics" not in state.scan_metadata:
                    state.scan_metadata["execution_metrics"] = {}
                
                cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
                if "report" not in state.scan_metadata["execution_metrics"]:
                    state.scan_metadata["execution_metrics"]["report"] = {
                        "prompt_tokens": 0, "completion_tokens": 0, "latency": 0.0, "cost": 0.0, "retries": 0
                    }
                
                state.scan_metadata["execution_metrics"]["report"]["prompt_tokens"] += usage["prompt_tokens"]
                state.scan_metadata["execution_metrics"]["report"]["completion_tokens"] += usage["completion_tokens"]
                state.scan_metadata["execution_metrics"]["report"]["latency"] += latency
                state.scan_metadata["execution_metrics"]["report"]["cost"] += cost
                state.scan_metadata["execution_metrics"]["report"]["retries"] = total_retries
                
                # 5. Parse and Validate output
                logger.info("Parsing and validating LLM response against Pydantic schema...")
                raw_json = json.loads(response_text)
                
                if "report" in raw_json and isinstance(raw_json["report"], dict):
                    raw_json = raw_json["report"]
                elif "report_section" in raw_json and isinstance(raw_json["report_section"], dict):
                    raw_json = raw_json["report_section"]
                    
                validated_report = ReportSection(**raw_json)
                
                # 6. Update PipelineState
                logger.info("Validation successful. Updating PipelineState.report.")
                state.report = validated_report
                
                break # Success! Break out of retry loop

            except (json.JSONDecodeError, ValidationError) as e:
                logger.warning(f"Validation failed on attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries:
                    logger.error("Max retries reached. Returning structured validation errors. PipelineState unchanged.")
                    # Return structured errors in state.report but leaving previous sections unchanged.
                    state.report = {"error": "Validation failed", "details": str(e)}
            except Exception as e:
                logger.error(f"Unexpected error during LLM invocation: {str(e)}")
                if attempt == max_retries:
                    state.report = {"error": "Unexpected Error", "details": str(e)}

        # 7. Return updated PipelineState
        logger.info("Report Generation complete. Returning updated PipelineState.")
        return state
