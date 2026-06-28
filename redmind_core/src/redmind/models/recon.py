from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class AssetSummary(BaseModel):
    domains: List[str] = Field(default_factory=list)
    subdomains: List[str] = Field(default_factory=list)
    applications: List[str] = Field(default_factory=list)
    api_endpoints: List[str] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)

class TechnologyInventory(BaseModel):
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    web_servers: List[str] = Field(default_factory=list)
    analytics: List[str] = Field(default_factory=list)

class CloudSummary(BaseModel):
    providers: List[str] = Field(default_factory=list)
    hosting: List[str] = Field(default_factory=list)
    cdn: List[str] = Field(default_factory=list)

class Repository(BaseModel):
    name: str
    platform: str
    visibility: str
    purpose: Optional[str] = None

class ReconRelationship(BaseModel):
    source: str
    relationship: str
    target: str

class ReconnaissanceSection(BaseModel):
    """
    The strict JSON contract for Agent 1's output section.
    """
    asset_summary: AssetSummary = Field(default_factory=AssetSummary)
    technology_inventory: Any = Field(default_factory=TechnologyInventory)
    cloud_summary: CloudSummary = Field(default_factory=CloudSummary)
    repositories: List[Repository] = Field(default_factory=list)
    third_party_services: Any = Field(default_factory=list)
    relationships: List[ReconRelationship] = Field(default_factory=list)
    recon_summary: str = ""
    confidence_score: float = 0.0
