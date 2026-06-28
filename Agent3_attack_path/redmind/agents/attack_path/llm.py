import os
import logging
from abc import ABC, abstractmethod
from typing import Dict, List
from openai import OpenAI

logger = logging.getLogger("AttackPathLLM")

class LLMClient(ABC):
    """Abstract interface for LLM operations to allow provider swapping."""
    @abstractmethod
    def query(self, messages: List[Dict[str, str]], retry_count: int = 0) -> tuple[str, dict, float]:
        pass

class FeatherlessClient(LLMClient):
    def __init__(self):
        self.api_key = os.getenv("FEATHERLESS_API_KEY")
        self.base_url = "https://api.aimlapi.com/v1"
        self.model = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
        
        if not self.api_key:
            logger.error("Initialization Failed: FEATHERLESS_API_KEY environment variable is required.")
            raise ValueError("FEATHERLESS_API_KEY environment variable is required.")
            
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

    def query(self, messages: List[Dict[str, str]], retry_count: int = 0) -> tuple[str, dict, float]:
        import time
        logger.info(f"Querying LLM (Model: {self.model}, Attempt: {retry_count + 1})")
        start_time = time.time()
        response = self.client.chat.completions.create(
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
