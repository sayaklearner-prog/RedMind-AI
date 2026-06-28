import json
import uuid
from datetime import datetime
from pydantic import ValidationError

from src.redmind.agents.evidence_collection.tools.firecrawl_client import FirecrawlClient
from src.redmind.agents.evidence_collection.tools.featherless_client import FeatherlessClient
from src.redmind.models.evidence import EvidenceOutput

class EvidenceCollectionAgent:
    """Agent 0: Collects and structures evidence from a target URL."""
    def __init__(self, target_url: str):
        self.target_url = target_url
        self.scan_id = str(uuid.uuid4())
        
        try:
            self.firecrawl = FirecrawlClient()
        except ValueError as e:
            print(f"Warning: {e} Firecrawl steps will fail.")
            self.firecrawl = None
            
        try:
            self.featherless = FeatherlessClient()
        except ValueError as e:
            print(f"Warning: {e} Featherless steps will fail.")
            self.featherless = None

    async def collect_evidence(self) -> EvidenceOutput:
        """Runs the collection and intelligence structuring pipeline."""
        print(f"Starting Evidence Collection for {self.target_url} (Scan ID: {self.scan_id})")
        
        # 1. Crawl the website
        print("Crawling website with Firecrawl...")
        if not self.firecrawl:
            raise RuntimeError("Firecrawl client is not configured.")
            
        firecrawl_data = await self.firecrawl.crawl(self.target_url)
        if not firecrawl_data.get("success"):
            print(f"Firecrawl failed: {firecrawl_data.get('error')}")
            # Still attempt to return an empty structured object
            return self._generate_empty_output()

        # 2. Extract intelligence using LLM
        print("Extracting and structuring intelligence with Featherless AI...")
        if not self.featherless:
            raise RuntimeError("Featherless client is not configured.")
            
        json_string, usage, latency = await self.featherless.extract_evidence(firecrawl_data)
        
        # 3. Validate and load into Pydantic models
        try:
            parsed_data = json.loads(json_string)
            # Inject metadata
            if "scan_metadata" not in parsed_data:
                parsed_data["scan_metadata"] = {}
            parsed_data["scan_metadata"]["scan_id"] = self.scan_id
            parsed_data["scan_metadata"]["target_url"] = self.target_url
            parsed_data["scan_metadata"]["timestamp"] = datetime.utcnow().isoformat()
            
            # Store Agent 0 metrics
            cost = (usage["prompt_tokens"] * 0.00000015) + (usage["completion_tokens"] * 0.0000006)
            parsed_data["scan_metadata"]["execution_metrics"] = {
                "evidence_collection": {
                    "prompt_tokens": usage["prompt_tokens"],
                    "completion_tokens": usage["completion_tokens"],
                    "latency": latency,
                    "cost": cost,
                    "retries": 0
                }
            }
            
            output = EvidenceOutput(**parsed_data)
            print("Evidence collection successful and validated.")
            return output
        except json.JSONDecodeError:
            print("Failed to decode JSON from Featherless AI.")
            print(f"Raw output: {json_string}")
            return self._generate_empty_output()
        except ValidationError as e:
            print(f"Validation error against Evidence schema: {e}")
            return self._generate_empty_output()

    def _generate_empty_output(self) -> EvidenceOutput:
        """Returns an empty schema instance on failure."""
        return EvidenceOutput(
            scan_metadata={
                "scan_id": self.scan_id,
                "target_url": self.target_url,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "failed"
            }
        )
