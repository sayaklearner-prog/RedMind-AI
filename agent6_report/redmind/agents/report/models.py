from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class ReportMetadata(BaseModel):
    analysis_id: str
    pipeline_version: str
    report_version: str = "1.0.0"
    generated_at: str
    execution_duration: str
    completed_agents: List[str]
    confidence_score: float = Field(ge=0.0, le=100.0)
    processing_statistics: Dict[str, Any]

class TraceableFinding(BaseModel):
    finding_id: str
    title: str
    description: str
    severity: str
    evidence_references: List[str] = Field(default_factory=list)
    attack_chain_id: Optional[str] = None
    related_risk_id: Optional[str] = None
    remediation_id: Optional[str] = None

class Recommendation(BaseModel):
    recommendation_id: str
    title: str
    description: str
    priority: str
    remediation_id: Optional[str] = None
    related_risk_id: Optional[str] = None

class Scorecard(BaseModel):
    overall_security_score: float = Field(ge=0.0, le=100.0)
    attack_surface_score: float = Field(ge=0.0, le=100.0)
    exposure_score: float = Field(ge=0.0, le=100.0)
    risk_score: float = Field(ge=0.0, le=100.0)
    remediation_readiness: float = Field(ge=0.0, le=100.0)
    operational_maturity: float = Field(ge=0.0, le=100.0)
    confidence_score: float = Field(ge=0.0, le=100.0)

class DashboardMetrics(BaseModel):
    risk_severity_distribution: Dict[str, int]
    asset_inventory: Dict[str, int]
    technology_inventory: Dict[str, int]
    cloud_services: Dict[str, int]
    exposure_categories: Dict[str, int]
    attack_path_graph_data: Dict[str, Any]
    risk_matrix: Dict[str, Any]
    remediation_progress: Dict[str, float]
    security_score_timeline: List[Dict[str, Any]]

class ExecutiveSummary(BaseModel):
    scope: str
    methodology: str
    evidence_summary: str
    critical_findings_summary: str
    top_10_risks_summary: str
    business_impact: str
    overall_security_posture_summary: str

class TechnicalSummary(BaseModel):
    reconnaissance_summary: str
    exposure_analysis: str
    attack_path_analysis: str
    risk_assessment: str
    technical_recommendations: str

class ReportSection(BaseModel):
    report_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    analysis_id: str
    
    executive_report: ExecutiveSummary
    technical_report: TechnicalSummary
    developer_checklist: str
    soc_summary: str
    management_summary: str
    compliance_summary: str
    
    security_scorecard: Scorecard
    dashboard_metrics: DashboardMetrics
    
    findings: List[TraceableFinding]
    recommendations: List[Recommendation]
    implementation_roadmap: str
    
    appendix: str
    metadata: ReportMetadata
