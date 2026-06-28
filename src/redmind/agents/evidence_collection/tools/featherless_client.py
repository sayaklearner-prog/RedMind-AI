import os
import json
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class FeatherlessClient:
    """Client for interacting with the Featherless AI (OpenAI compatible API)."""
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.aimlapi.com/v1"):
        self.api_key = api_key or os.getenv("FEATHERLESS_API_KEY")
        if not self.api_key:
            raise ValueError("FEATHERLESS_API_KEY is not set.")
        
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            base_url=base_url
        )
        # Using a standard 70B instruct model as requested
        self.model = "meta-llama/Llama-3.3-70B-Instruct-Turbo"

    async def extract_evidence(self, firecrawl_data: Dict[str, Any]) -> tuple[str, dict, float]:
        """Takes Firecrawl data and extracts structured JSON using the LLM."""
        
        system_prompt = """
You are the Evidence Collection & Intelligence Agent for the RedMind AI cybersecurity platform.
Your ONLY responsibility is to collect verified public website information and organize it into a standardized JSON object.
Use the provided Firecrawl extracted evidence. Analyze ONLY the extracted evidence.
Never invent information. Never guess technologies. Never infer vulnerabilities.
Never calculate risks. Never recommend remediation. Never generate attack paths.

If information cannot be verified, place it inside "not_found" or "unknown".

Return ONLY valid JSON. No Markdown. No explanation. No reasoning. No extra text.
Use exactly this schema:
{
"scan_metadata": {"scan_id": "", "timestamp": "", "target_url": "", "status": "completed"},
"organisation": "", "primary_domain": "",
"website_profile": {"title": "", "description": "", "language": "", "country": ""},
"asset_inventory": {"domains": [], "subdomains": [], "public_pages": [], "public_assets": [], "api_endpoints": []},
"technology_stack": {"frontend": [], "backend": [], "frameworks": [], "programming_languages": [], "databases": [], "web_servers": [], "cms": [], "analytics": []},
"cloud_infrastructure": {"provider": [], "cdn": [], "hosting": []},
"repositories": [], "external_services": [],
"security_configuration": {"security_headers": [], "ssl_certificate": {}, "cookies": [], "cors": {}, "redirects": []},
"public_documents": [], "verified_evidence": [], "likely_evidence": [], "not_found": [],
"summary": "", "confidence_score": 0
}

Before returning the JSON:
* Ensure all keys exist. Arrays must always remain arrays. Objects must remain objects.
* Missing values must be [] or {} or null.
* Confidence score must be between 0 and 100.
* Preserve all verified evidence exactly as observed. Never fabricate missing data.
"""
        
        # We only pass a stringified version of the relevant data to avoid token limits
        data_to_analyze = json.dumps(firecrawl_data.get("data", {}))
        # Limit to 50k chars just in case to prevent context length errors
        data_to_analyze = data_to_analyze[:50000]
        
        user_prompt = f"Extract structured intelligence from the following Firecrawl data:\n\n{data_to_analyze}"

        import time
        start_time = time.time()
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=8192,
                response_format={"type": "json_object"}
            )
            latency = time.time() - start_time
            usage = {
                "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                "completion_tokens": response.usage.completion_tokens if response.usage else 0
            }
            
            result_text = response.choices[0].message.content.strip()
            
            # Clean up markdown code blocks if the LLM still outputs them despite instructions
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
                
            return result_text.strip(), usage, latency
            
        except Exception as e:
            print(f"Featherless AI error: {e}")
            return "{}", {"prompt_tokens": 0, "completion_tokens": 0}, 0.0
