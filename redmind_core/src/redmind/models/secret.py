from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
import hashlib

# Agent 1 Imports for correlation and graph compatibility
from src.redmind.models.asset import AssetBase
from src.redmind.models.graph import RelationshipType, GraphData, GraphNode, GraphEdge

class ExposureCategory(str, Enum):
    CREDENTIAL = "Credential"
    TOKEN = "Token"
    CONFIGURATION = "Configuration"
    CLOUD_REFERENCE = "Cloud Reference"
    SENSITIVE_DOCUMENT = "Sensitive Document"
    BACKUP_ARTIFACT = "Backup Artifact"
    INTERNAL_INFORMATION = "Internal Information"
    INFRASTRUCTURE_REFERENCE = "Infrastructure Reference"
    CI_CD_CREDENTIAL = "CI/CD Credential"
    CONTAINER_REGISTRY_CREDENTIAL = "Container Registry Credential"
    KUBERNETES_SECRET_REFERENCE = "Kubernetes Secret Reference"
    WEBHOOK_SECRET = "Webhook Secret"
    ENCRYPTION_MATERIAL = "Encryption Material"
    INTERNAL_ENDPOINT_REFERENCE = "Internal Endpoint Reference"
    UNKNOWN = "Unknown"

class SecretState(str, Enum):
    ACTIVE = "ACTIVE"
    REMOVED = "REMOVED"
    ROTATED = "ROTATED"
    HISTORICAL = "HISTORICAL"
    UNKNOWN = "UNKNOWN"

class RiskIndicator(str, Enum):
    CLOUD_CREDENTIAL = "Cloud Credential"
    PRODUCTION_CONTEXT = "Production Context"
    AUTHENTICATION_RELATED = "Authentication Related"
    EXTERNAL_EXPOSURE = "External Exposure"
    INFRASTRUCTURE_RELATED = "Infrastructure Related"
    SENSITIVE_CONFIGURATION = "Sensitive Configuration"

class SecretFingerprint(BaseModel):
    """
    Masked fingerprint for identification and tracking. 
    Never stores the full secret.
    """
    hash_sha256: str = Field(description="SHA-256 hash of the full secret for tracking rotation/removal")
    masked_preview: str = Field(description="Masked preview, e.g., 'ghp_****a1b2'")
    entropy: float = Field(default=0.0, description="Shannon entropy score of the secret")
    length: int = Field(description="Original length of the secret")

    @classmethod
    def generate(cls, raw_secret: str, prefix_len: int = 4, suffix_len: int = 4) -> "SecretFingerprint":
        """Helper to generate a masked fingerprint from a raw secret."""
        import math
        from collections import Counter
        
        # Calculate entropy
        p, lns = Counter(raw_secret), float(len(raw_secret))
        entropy = -sum(count/lns * math.log2(count/lns) for count in p.values())
        
        # Create mask
        if len(raw_secret) <= prefix_len + suffix_len:
            masked = "***"
        else:
            masked = f"{raw_secret[:prefix_len]}****{raw_secret[-suffix_len:]}"
            
        return cls(
            hash_sha256=hashlib.sha256(raw_secret.encode()).hexdigest(),
            masked_preview=masked,
            entropy=entropy,
            length=len(raw_secret)
        )

class SecretFinding(BaseModel):
    id: str = Field(description="Unique identifier for the finding")
    categories: List[ExposureCategory]
    fingerprint: SecretFingerprint
    state: SecretState = SecretState.ACTIVE
    risk_indicators: List[RiskIndicator] = Field(default_factory=list)
    
    # Confidence Scoring
    confidence_score: float = Field(ge=0.0, le=100.0)
    confidence_factors: List[str] = Field(description="E.g., Pattern Match, Context Match, Repo Ownership")
    
    # Secret-to-Asset Mapping
    related_asset_id: Optional[str] = None
    mapping_confidence: float = Field(default=0.0, ge=0.0, le=100.0)
    
    # Discovery Sources
    source_type: str = Field(description="E.g., Repository, Configuration File, Storage Endpoint")
    source_location: str = Field(description="URL or path where the exposure was found")
    discovery_timestamp: datetime = Field(default_factory=datetime.utcnow)
    evidence: str = Field(description="Contextual code snippet or metadata (MUST NOT contain the raw secret)")

class CorrelationStrength(BaseModel):
    relationship: RelationshipType
    score: float = Field(ge=0.0, le=100.0)
    explanation: str = Field(description="Why the relationship was established")

class ExposureCluster(BaseModel):
    cluster_id: str
    cluster_name: str = Field(description="E.g., Authentication Exposure, Cloud Exposure")
    finding_ids: List[str]
    cluster_summary: str = Field(description="Aggregate intelligence summary for this cluster")

class AttackSurfaceSummary(BaseModel):
    total_findings: int
    credential_findings: int
    configuration_findings: int
    cloud_findings: int
    authentication_findings: int
    devops_findings: int
    historical_trends: Dict[str, Any] = Field(default_factory=dict, description="Exposure trends vs previous scans")

class SecretDiscoveryOutput(BaseModel):
    """
    Machine-Readable Handoff Package for Agent 3
    """
    scan_id: str
    target: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    findings: List[SecretFinding]
    clusters: List[ExposureCluster]
    attack_surface_summary: AttackSurfaceSummary
    
    # Agent 1 compatibility
    unified_graph: GraphData = Field(description="Unified Node-Edge output combining Recon and Secret graphs")
    intelligence_summary: str = Field(description="High-level narrative of exposure trends (No severity assigned)")
