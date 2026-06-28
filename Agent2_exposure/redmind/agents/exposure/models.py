from typing import List
from pydantic import BaseModel, Field

class AssetExposure(BaseModel):
    public_domains: List[str] = Field(default_factory=list)
    public_subdomains: List[str] = Field(default_factory=list)
    applications: List[str] = Field(default_factory=list)
    api_endpoints: List[str] = Field(default_factory=list)
    admin_interfaces: List[str] = Field(default_factory=list)
    public_documents: List[str] = Field(default_factory=list)
    repositories: List[str] = Field(default_factory=list)

class InternetSurface(BaseModel):
    cloud_services: List[str] = Field(default_factory=list)
    cdn: List[str] = Field(default_factory=list)
    hosting: List[str] = Field(default_factory=list)
    external_services: List[str] = Field(default_factory=list)

class ExposureSection(BaseModel):
    """
    Agent 2 Output: Strict PipelineState Section for Exposure Analysis
    """
    asset_exposure: AssetExposure = Field(default_factory=AssetExposure)
    internet_surface: InternetSurface = Field(default_factory=InternetSurface)
    authentication_surfaces: List[str] = Field(default_factory=list)
    external_dependencies: List[str] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)
    exposure_summary: str = Field(default="")
    confidence_score: int = Field(default=0, ge=0, le=100)
