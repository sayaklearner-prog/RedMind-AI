import os

def get_exposure_system_prompt() -> str:
    """
    Loads the Exposure Agent system prompt from the external markdown file.
    """
    prompt_path = os.path.join("prompts", "agent2_exposure.md")
    with open(prompt_path, "r") as f:
        return f.read()
