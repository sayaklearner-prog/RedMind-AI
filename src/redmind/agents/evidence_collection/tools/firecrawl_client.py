import os
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class FirecrawlClient:
    """Client for interacting with the Firecrawl API."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("FIRECRAWL_API_KEY")
        if not self.api_key:
            raise ValueError("FIRECRAWL_API_KEY is not set.")
        self.base_url = "https://api.firecrawl.dev/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def crawl(self, url: str) -> Dict[str, Any]:
        """Initiates a scrape request using Firecrawl."""
        endpoint = f"{self.base_url}/scrape"
        payload = {
            "url": url,
            "formats": ["markdown", "html"],
            "onlyMainContent": False,
            "includeTags": ["title", "meta", "h1", "h2", "h3", "a", "img"],
            "mobile": False
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(endpoint, headers=self.headers, json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Firecrawl API error: {e}")
                if isinstance(e, httpx.HTTPStatusError):
                    print(f"Response: {e.response.text}")
                return {"success": False, "error": str(e)}
