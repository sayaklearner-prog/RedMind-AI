import os
import json
import logging
from openai import AsyncOpenAI
from typing import Any, Dict

logger = logging.getLogger("ReportLLM")

class LLMProvider:
    """
    Abstract LLM interface using Featherless API.
    """
    def __init__(self, provider_name: str = "Featherless"):
        self.provider_name = provider_name
        self.api_key = "rc_6918835fbf07991ec156380a4d2606c6d035a6f489d2e8470cd07a78f0580c74"
        self.base_url = "https://api.featherless.ai/v1"
        self.model = "open-r1/OlympicCoder-7B"
        
        if not self.api_key:
            raise ValueError("FEATHERLESS_API_KEY environment variable is required.")
            
        self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        
    async def generate_json(self, system_prompt: str, user_prompt: str) -> tuple[str, dict, float]:
        """
        Sends the prompt to the LLM and requests a JSON response.
        """
        logger.info(f"[{self.provider_name}] Invoking LLM for Report Generation...")
        
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
