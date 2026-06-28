import os
from src.redmind.models.pipeline_state import PipelineState

class RemediationPromptBuilder:
    def __init__(self):
        # Path relative to the project root
        self.prompt_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__), 
                "..", "..", "..", "..", 
                "prompts", "agent5_remediation.md"
            )
        )
        
    def build_system_prompt(self) -> str:
        if not os.path.exists(self.prompt_path):
            raise FileNotFoundError(f"Master prompt not found at {self.prompt_path}")
            
        with open(self.prompt_path, 'r') as f:
            return f.read()
            
    def build_user_prompt(self, state: PipelineState) -> str:
        # Construct a prompt based on the sections from PipelineState
        # We only pass evidence, recon, exposure, attack_paths, and risk
        
        user_prompt = "Generate a RemediationSection based on the following pipeline intelligence:\n\n"
        
        if state.recon:
            user_prompt += "=== RECON ===\n"
            user_prompt += state.recon.model_dump_json() + "\n\n"
            
        if state.exposure:
            user_prompt += "=== EXPOSURE ===\n"
            user_prompt += state.exposure.model_dump_json() + "\n\n"
            
        if state.attack_paths:
            user_prompt += "=== ATTACK PATHS ===\n"
            user_prompt += state.attack_paths.model_dump_json() + "\n\n"
            
        if state.risk:
            user_prompt += "=== RISK ===\n"
            user_prompt += state.risk.model_dump_json() + "\n\n"
            
        return user_prompt
