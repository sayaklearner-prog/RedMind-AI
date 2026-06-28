from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from src.redmind.models.graph import RelationshipType, GraphNode, GraphEdge, GraphData, Relationship

class AssetTag(str, Enum):
    PRODUCTION = "production"
    STAGING = "staging"
    DEVELOPMENT = "development"
    INTERNAL = "internal"
    CUSTOMER_FACING = "customer-facing"
    API = "api"
    AUTHENTICATION = "authentication"
    CLOUD = "cloud"
    REPOSITORY = "repository"
    STORAGE = "storage"

class ExposureLevel(str, Enum):
    PUBLIC = "Public"
    EXTERNAL = "External"
    PARTNER = "Partner"
    RESTRICTED = "Restricted"
    UNKNOWN = "Unknown"

class Evidence(BaseModel):
    source: str = Field(description="Where the evidence was found (e.g., DNS, SSL, GitHub, SERP)")
    details: str = Field(description="Specific details of the evidence")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AssetBase(BaseModel):
    id: str = Field(description="Unique identifier for the asset")
    asset_type: Literal["domain", "subdomain", "ip", "service", "repository", "cloud_bucket"]
    name: str = Field(description="The actual domain, IP, or name of the asset")
    
    # Explainable Confidence Scoring
    confidence_score: float = Field(ge=0.0, le=100.0, description="Confidence score 0-100%")
    confidence_factors: List[str] = Field(default_factory=list, description="List of factors contributing to the score")
    
    # Ownership
    ownership_status: Literal["Confirmed", "Probable", "Unverified"]
    ownership_reasoning: str = Field(description="Reasoning behind the ownership status")
    
    # Criticality and Tags
    criticality: Literal["Critical", "High", "Medium", "Low", "Unknown"] = "Unknown"
    tags: List[AssetTag] = Field(default_factory=list)
    
    # Exposure Classification
    exposure_classification: ExposureLevel = ExposureLevel.UNKNOWN
    exposure_evidence: List[str] = Field(default_factory=list, description="Evidence supporting the exposure classification")
    
    evidence: List[Evidence] = Field(default_factory=list)
    first_seen: datetime = Field(default_factory=datetime.utcnow)
    last_seen: datetime = Field(default_factory=datetime.utcnow)

class DomainAsset(AssetBase):
    asset_type: Literal["domain"] = "domain"
    registrar: Optional[str] = None
    nameservers: List[str] = Field(default_factory=list)

class SubdomainAsset(AssetBase):
    asset_type: Literal["subdomain"] = "subdomain"
    parent_domain: str
    resolves_to: List[str] = Field(default_factory=list, description="IP addresses it resolves to")

class ServiceAsset(AssetBase):
    asset_type: Literal["service"] = "service"
    ip_or_host: str
    port: int
    protocol: str = Field(description="e.g., http, https, ssh")
    technologies: List[str] = Field(default_factory=list, description="Fingerprinted technologies")
    ssl_issuer: Optional[str] = None
    ssl_expires: Optional[datetime] = None

class CloudAsset(AssetBase):
    asset_type: Literal["cloud_bucket"] = "cloud_bucket"
    provider: str = Field(description="e.g., AWS, GCP, Azure")
    url: str

class RepositoryAsset(AssetBase):
    asset_type: Literal["repository"] = "repository"
    platform: str = Field(description="e.g., GitHub, GitLab")
    url: str
    is_public: bool = True




class ScanMetadata(BaseModel):
    scan_id: str
    target: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    agent_version: str = "1.1.0-recon-upgrade"
    duration_seconds: float
    asset_count: int
    relationship_count: int

class ReconOutput(BaseModel):
    """
    Machine-Readable Handoff Package
    Optimized for direct consumption by downstream agents.
    """
    metadata: ScanMetadata
    assets: List[AssetBase]
    tags_inventory: List[str] = Field(default_factory=list, description="Unique tags found across all assets")
    exposure_classifications: Dict[str, int] = Field(default_factory=dict, description="Count of assets per exposure level")
    relationships: List[Relationship]
    graph_data: GraphData
    historical_changes: Dict[str, Any] = Field(default_factory=dict)
    intelligence_summary: str
