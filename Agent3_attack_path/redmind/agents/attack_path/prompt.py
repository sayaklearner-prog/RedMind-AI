import os

def get_attack_path_system_prompt() -> str:
    """
    Loads the system prompt for the Attack Path Analysis Agent.
    """
    prompt_path = os.path.join(
        os.path.dirname(__file__), 
        "../../../../prompts/agent3_attack_path.md"
    )
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()
