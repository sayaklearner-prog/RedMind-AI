import os
import json
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Abstracted LLM Provider Interface using Featherless API.
    """
    def __init__(self, provider: str = "default"):
        self.api_key = os.getenv("FEATHERLESS_API_KEY")
        self.base_url = "https://api.aimlapi.com/v1"
        self.model = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
        
        if not self.api_key:
            raise ValueError("FEATHERLESS_API_KEY environment variable is required.")
            
        self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        
    async def generate_structured_json(self, system_prompt: str, user_prompt: str) -> tuple[str, dict, float]:
        """
        Sends the prompt to the LLM and requests a JSON response matching the required schema.
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        import time
        start_time = time.time()
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.2,
            max_tokens=8192,
            response_format={"type": "json_object"}
        )
        latency = time.time() - start_time
        usage = {
            "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
            "completion_tokens": response.usage.completion_tokens if response.usage else 0
        }
        
        return response.choices[0].message.content, usage, latency
