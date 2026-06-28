import os
import json
from openai import OpenAI
from src.redmind.models.pipeline_state import PipelineState
from src.redmind.models.recon import ReconnaissanceSection
from pydantic import ValidationError

class ReconIntelligenceAgent:
    """
    Agent 1: Reconnaissance Intelligence Agent.
    Strictly passive reasoning engine. Consumes Evidence, outputs Reconnaissance.
    """
    def __init__(self):
        self.api_key = os.getenv("FEATHERLESS_API_KEY")
        self.base_url = "https://api.aimlapi.com/v1"
        self.model = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
        
        if not self.api_key:
            raise ValueError("FEATHERLESS_API_KEY environment variable is required.")
            
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

    def _get_system_prompt(self) -> str:
        with open("prompts/agent1_recon.md", "r") as f:
            return f.read()

    def analyze(self, state: PipelineState) -> PipelineState:
        """
        Takes the global PipelineState, reads the `evidence` section, 
        and mutates ONLY the `recon` section using LLM structured generation.
        """
        print("Agent 1 (Recon Intelligence) starting analysis...")
        
        if not state.evidence:
            raise ValueError("No evidence found in PipelineState. Evidence Collection Agent must run first.")

        system_prompt = self._get_system_prompt()
        
        # We instruct the model to return ONLY the pure JSON object for the recon section
        user_message = f"""
        Here is the validated evidence JSON. 
        Return ONLY the valid JSON object for the "reconnaissance" section matching your schema. 
        Do not wrap in Markdown. Do not return the original evidence. ONLY the reconnaissance object.

        EVIDENCE JSON:
        {json.dumps(state.evidence)}
        """

        try:
            print("Querying LLM (Featherless) for Reconnaissance Intelligence...")
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            import time
            start_time = time.time()
            
            max_retries = 1
            for attempt in range(max_retries + 1):
                try:
                    print(f"Invoking LLM (Attempt {attempt + 1}/{max_retries + 1})")
                    response = self.client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        temperature=0.1, # Low temp for structured data extraction
                        max_tokens=8192,
                        response_format={"type": "json_object"} # Force JSON output if supported by Featherless
                    )
                    
                    # Extract and parse the raw JSON text
                    raw_json_output = response.choices[0].message.content
                    parsed_json = json.loads(raw_json_output)
                    
                    # Capture metrics
                    prompt_tokens = response.usage.prompt_tokens if response.usage else 0
                    completion_tokens = response.usage.completion_tokens if response.usage else 0
                    latency = time.time() - start_time
                    cost = (prompt_tokens * 0.00000015) + (completion_tokens * 0.0000006) # Example Featherless pricing
                    
                    if "execution_metrics" not in state.scan_metadata:
                        state.scan_metadata["execution_metrics"] = {}
                    
                    state.scan_metadata["execution_metrics"]["recon"] = {
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "latency": latency,
                        "cost": cost,
                        "retries": attempt
                    }
                    
                    # Handle unwrapping
                    if "reconnaissance" in parsed_json and isinstance(parsed_json["reconnaissance"], dict):
                        parsed_json = parsed_json["reconnaissance"]
                    elif "recon" in parsed_json and isinstance(parsed_json["recon"], dict):
                        parsed_json = parsed_json["recon"]
                        
                    # Validate output strictly against the Pydantic ReconnaissanceSection model
                    print("Validating LLM output against Pydantic schema...")
                    validated_recon = ReconnaissanceSection(**parsed_json)
                    
                    # Mutate the shared pipeline state safely
                    state.recon = validated_recon
                    print("Agent 1 analysis complete. Recon section populated.")
                    
                    return state

                except (json.JSONDecodeError, ValidationError) as e:
                    print(f"Validation failed on attempt {attempt + 1}: {e}")
                    if attempt == max_retries:
                        print("Max retries reached. Raising error.")
                        raise RuntimeError(f"ReconAgent failed after retry: {e}")
                        
                    retry_message = f"""
                    Your previous output failed validation. You MUST return valid JSON matching the schema.
                    Error details: {str(e)}
                    
                    Previous invalid output:
                    {raw_json_output}
                    
                    Please correct the errors and output ONLY the valid JSON object.
                    """
                    messages.append({"role": "assistant", "content": raw_json_output})
                    messages.append({"role": "user", "content": retry_message})
                    
        except Exception as e:
            print(f"Error during LLM analysis: {e}")
            raise e
