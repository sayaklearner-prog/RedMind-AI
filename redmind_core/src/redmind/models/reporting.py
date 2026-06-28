from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class TrendIndicator(str, Enum):
    IMPROVING = "Improving"
    STABLE = "Stable"
    DETERIORATING = "Deteriorating"
    UNKNOWN = "Unknown"

class IntelligenceCoverageMetrics(BaseModel):
    intelligence_coverage_score: float = Field(ge=0.0, le=100.0)
    reporting_completeness_score: float = Field(ge=0.0, le=100.0)
    missing_information: List[str] = Field(default_factory=list)

class SecurityPostureAnalysis(BaseModel):
    attack_surface_size: int
    exposure_volume: int
    risk_distribution: Dict[str, int]
    critical_asset_coverage: float = Field(ge=0.0, le=100.0)
    security_trend_direction: TrendIndicator
    security_posture_score: float = Field(ge=0.0, le=100.0)
    security_posture_rationale: str

class ExecutiveKPI(BaseModel):
    kpi_name: str
    current_value: str
    historical_value: Optional[str] = None
    trend: TrendIndicator
    confidence_level: float = Field(ge=0.0, le=100.0)
    supporting_evidence: str

class KPIDashboardData(BaseModel):
    total_assets: ExecutiveKPI
    critical_assets: ExecutiveKPI
    exposed_assets: ExecutiveKPI
    active_attack_paths: ExecutiveKPI
    critical_risks: ExecutiveKPI
    high_risks: ExecutiveKPI
    remediation_progress: ExecutiveKPI
    risk_reduction_percentage: ExecutiveKPI
    exposure_reduction_percentage: ExecutiveKPI
    mean_time_to_remediate_mttr: ExecutiveKPI
    remediation_completion_rate: ExecutiveKPI

class Scorecard(BaseModel):
    score: float = Field(ge=0.0, le=100.0)
    rationale: str
    key_drivers: List[str] = Field(default_factory=list)

class SecurityScorecards(BaseModel):
    asset_security: Scorecard
    exposure_management: Scorecard
    attack_path_management: Scorecard
    risk_management: Scorecard
    remediation_performance: Scorecard
    overall_security_posture: Scorecard

class TrendIntelligence(BaseModel):
    improving_areas: List[str] = Field(default_factory=list)
    stable_areas: List[str] = Field(default_factory=list)
    deteriorating_areas: List[str] = Field(default_factory=list)
    emerging_risk_areas: List[str] = Field(default_factory=list)
    security_maturity_trend: TrendIndicator

class ComplianceFramework(BaseModel):
    framework_name: str
    coverage_estimate: float = Field(ge=0.0, le=100.0)
    aligned_controls: int
    gap_summary: List[str] = Field(default_factory=list)

class ComplianceIntelligence(BaseModel):
    nist_csf: ComplianceFramework
    iso_27001: ComplianceFramework
    soc_2: ComplianceFramework
    cis_controls: ComplianceFramework
    overall_compliance_alignment_score: float = Field(ge=0.0, le=100.0)

class ExecutiveNarratives(BaseModel):
    security_leadership_narrative: str
    engineering_leadership_narrative: str
    executive_leadership_narrative: str
    board_level_narrative: str

class ForecastingIntelligence(BaseModel):
    security_posture_forecast: str
    risk_trend_forecast: str
    remediation_completion_forecast: str
    exposure_reduction_forecast: str
    confidence_levels: Dict[str, float] = Field(default_factory=dict)
    supporting_evidence: List[str] = Field(default_factory=list)

class ExecutiveDashboard(BaseModel):
    security_posture_score: float = Field(ge=0.0, le=100.0)
    risk_health_score: float = Field(ge=0.0, le=100.0)
    exposure_health_score: float = Field(ge=0.0, le=100.0)
    remediation_health_score: float = Field(ge=0.0, le=100.0)
    compliance_alignment_score: float = Field(ge=0.0, le=100.0)
    overall_trend: TrendIndicator
    key_metrics: KPIDashboardData

class BoardSummary(BaseModel):
    top_business_risks: List[str] = Field(default_factory=list)
    key_achievements: List[str] = Field(default_factory=list)
    key_recommendations: List[str] = Field(default_factory=list)
    strategic_outlook: str

class ExecutiveReports(BaseModel):
    executive_summary: str
    security_operations_report: str
    risk_report: str
    remediation_progress_report: str
    compliance_report: str
    strategic_recommendations_summary: str

class ReportingIntelligenceOutput(BaseModel):
    report_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    metadata: Dict[str, Any]
    intelligence_coverage_metrics: IntelligenceCoverageMetrics
    security_posture_analysis: SecurityPostureAnalysis
    
    dashboard: ExecutiveDashboard
    security_scorecards: SecurityScorecards
    trend_intelligence: TrendIntelligence
    compliance_intelligence: ComplianceIntelligence
    
    executive_narratives: ExecutiveNarratives
    forecasting_intelligence: ForecastingIntelligence
    
    executive_reports: ExecutiveReports
    board_summary: BoardSummary
    
    intelligence_summary: str
