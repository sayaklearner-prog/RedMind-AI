import json
import logging
from src.redmind.models.pipeline_state import PipelineState

logger = logging.getLogger("ReportPromptBuilder")

class ReportPromptBuilder:
    """
    Constructs the prompt for the Report Generation Agent.
    Strictly follows the prompt isolation pattern.
    """
    def __init__(self, prompt_path: str = "prompts/agent6_report.md"):
        self.prompt_path = prompt_path

    def _load_system_prompt(self) -> str:
        try:
            with open(self.prompt_path, "r") as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"Failed to load system prompt from {self.prompt_path}")
            raise

    def build_system_prompt(self) -> str:
        return self._load_system_prompt()

    def build_user_prompt(self, state: PipelineState) -> str:
        logger.info("Constructing User Prompt from PipelineState for Report Generation...")
        
        # Serialize only the allowed sections
        payload = {
            "recon": state.recon.model_dump(mode='json') if state.recon else None,
            "exposure": state.exposure.model_dump(mode='json') if state.exposure else None,
            "attack_paths": state.attack_paths.model_dump(mode='json') if state.attack_paths else None,
            "risk": state.risk.model_dump(mode='json') if state.risk else None,
            "remediation": state.remediation.model_dump(mode='json') if state.remediation else None
        }
        
        user_prompt = "Generate the final presentation reports based on the following pipeline data:\n\n"
        user_prompt += json.dumps(payload, indent=2)
        
        return user_prompt
