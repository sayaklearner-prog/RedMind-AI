import os

def get_risk_system_prompt() -> str:
    """
    Loads and returns the system prompt for Agent 4 (Risk Assessment Agent).
    """
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "prompts", "agent4_risk.md")
    try:
        with open(prompt_path, "r") as f:
            return f.read()
    except FileNotFoundError:
        # Fallback if the file path logic differs based on cwd
        fallback_path = os.path.join(os.getcwd(), "prompts", "agent4_risk.md")
        with open(fallback_path, "r") as f:
            return f.read()
