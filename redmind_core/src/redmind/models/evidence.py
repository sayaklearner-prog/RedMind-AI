from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScanMetadata(BaseModel):
    scan_id: Optional[str] = None
    timestamp: Optional[str] = None
    target_url: Optional[str] = None
    status: str = "completed"

class WebsiteProfile(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    country: Optional[str] = None

class AssetInventory(BaseModel):
    domains: List[str] = Field(default_factory=list)
    subdomains: List[str] = Field(default_factory=list)
    public_pages: List[str] = Field(default_factory=list)
    public_assets: List[str] = Field(default_factory=list)
    api_endpoints: List[str] = Field(default_factory=list)

class TechnologyStack(BaseModel):
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    web_servers: List[str] = Field(default_factory=list)
    cms: List[str] = Field(default_factory=list)
    analytics: List[str] = Field(default_factory=list)

class CloudInfrastructure(BaseModel):
    provider: List[str] = Field(default_factory=list)
    cdn: List[str] = Field(default_factory=list)
    hosting: List[str] = Field(default_factory=list)

class SecurityConfiguration(BaseModel):
    security_headers: List[str] = Field(default_factory=list)
    ssl_certificate: Dict[str, Any] = Field(default_factory=dict)
    cookies: List[str] = Field(default_factory=list)
    cors: Dict[str, Any] = Field(default_factory=dict)
    redirects: List[str] = Field(default_factory=list)

class EvidenceOutput(BaseModel):
    scan_metadata: ScanMetadata = Field(default_factory=ScanMetadata)
    organisation: Optional[str] = None
    primary_domain: Optional[str] = None
    website_profile: WebsiteProfile = Field(default_factory=WebsiteProfile)
    asset_inventory: AssetInventory = Field(default_factory=AssetInventory)
    technology_stack: TechnologyStack = Field(default_factory=TechnologyStack)
    cloud_infrastructure: CloudInfrastructure = Field(default_factory=CloudInfrastructure)
    repositories: List[str] = Field(default_factory=list)
    external_services: List[str] = Field(default_factory=list)
    security_configuration: SecurityConfiguration = Field(default_factory=SecurityConfiguration)
    public_documents: List[str] = Field(default_factory=list)
    verified_evidence: List[str] = Field(default_factory=list)
    likely_evidence: List[str] = Field(default_factory=list)
    not_found: List[str] = Field(default_factory=list)
    summary: Optional[str] = None
    confidence_score: int = Field(default=0, ge=0, le=100)
