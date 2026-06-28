from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class RiskCategory(str, Enum):
    AUTHENTICATION = "Authentication Risk"
    CLOUD = "Cloud Risk"
    REPOSITORY = "Repository Risk"
    STORAGE = "Storage Risk"
    DEVELOPMENT = "Development Risk"
    PRODUCTION = "Production Risk"
    ADMINISTRATIVE = "Administrative Risk"
    HYBRID = "Hybrid Infrastructure Risk"

class RiskSignalType(str, Enum):
    AUTHENTICATION = "Authentication Signal"
    CLOUD = "Cloud Signal"
    EXPOSURE = "Exposure Signal"
    DEPENDENCY = "Dependency Signal"
    PERSISTENCE = "Persistence Signal"
    BLAST_RADIUS = "Blast Radius Signal"

class RiskSignal(BaseModel):
    signal_type: RiskSignalType
    signal_strength: float = Field(ge=0.0, le=100.0)
    evidence: str

class BusinessImpact(BaseModel):
    operational_impact: float = Field(ge=0.0, le=100.0)
    data_exposure_impact: float = Field(ge=0.0, le=100.0)
    availability_impact: float = Field(ge=0.0, le=100.0)
    customer_impact: float = Field(ge=0.0, le=100.0)
    overall_business_impact_score: float = Field(ge=0.0, le=100.0)
    justification: str

class RiskOwnership(BaseModel):
    likely_owner: str
    owner_type: str = Field(description="System, Team, Asset, or Individual")
    confidence: float = Field(ge=0.0, le=100.0)

class RiskPersistence(BaseModel):
    first_seen: datetime
    last_seen: datetime
    occurrence_count: int
    trend_direction: str = Field(description="Increasing, Decreasing, Stable, New, Resolved")

class RiskScoreBase(BaseModel):
    risk_id: str
    categories: List[RiskCategory]
    base_score: float = Field(ge=0.0, le=100.0)
    priority_score: float = Field(ge=0.0, le=100.0)
    priority_rank: int
    confidence_score: float = Field(ge=0.0, le=100.0)
    explanation: str
    signals: List[RiskSignal] = Field(default_factory=list)
    business_impact: BusinessImpact
    ownership: RiskOwnership
    persistence: RiskPersistence
    related_assets: List[str] = Field(default_factory=list)
    related_exposures: List[str] = Field(default_factory=list)
    related_attack_paths: List[str] = Field(default_factory=list)
    related_choke_points: List[str] = Field(default_factory=list)
    blast_radius_estimate: float = Field(ge=0.0, le=100.0)

class AssetRiskScore(RiskScoreBase):
    pass

class ExposureRiskScore(RiskScoreBase):
    pass

class AttackPathRiskScore(RiskScoreBase):
    pass

class RiskCluster(BaseModel):
    cluster_id: str
    primary_category: RiskCategory
    risk_ids: List[str]
    aggregate_priority_score: float = Field(ge=0.0, le=100.0)
    summary: str

class PortfolioAnalytics(BaseModel):
    total_risks: int
    high_priority_risks: int
    concentration_by_category: Dict[str, float]
    concentration_by_zone: Dict[str, float]
    concentration_by_business_function: Dict[str, float]

class DataQualityMetrics(BaseModel):
    asset_integrity: float
    exposure_integrity: float
    attack_path_integrity: float
    relationship_consistency: float
    confidence_availability: float
    overall_quality_score: float

class IntelligenceCompletenessMetrics(BaseModel):
    missing_assets: int
    missing_exposures: int
    missing_paths: int
    overall_completeness_score: float

class ExecutiveRiskIntelligence(BaseModel):
    top_10_risks: List[str]
    highest_business_impact_risks: List[str]
    fastest_growing_risks: List[str]
    most_persistent_risks: List[str]
    largest_blast_radius_risks: List[str]
    most_connected_risk_clusters: List[str]

class RiskPrioritizationOutput(BaseModel):
    scan_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    metadata: Dict[str, Any]
    data_quality_metrics: DataQualityMetrics
    intelligence_completeness_metrics: IntelligenceCompletenessMetrics
    
    asset_risk_scores: List[AssetRiskScore]
    exposure_risk_scores: List[ExposureRiskScore]
    attack_path_risk_scores: List[AttackPathRiskScore]
    
    risk_clusters: List[RiskCluster]
    
    portfolio_analytics: PortfolioAnalytics
    executive_risk_intelligence: ExecutiveRiskIntelligence
    
    intelligence_summary: str
