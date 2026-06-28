from typing import List, Optional
from pydantic import BaseModel, Field

class RemediationPlan(BaseModel):
    remediation_id: str = Field(description="Unique identifier for the remediation plan (e.g., RM-001)")
    related_risk_id: str = Field(description="ID of the related RiskAssessment (e.g., RK-001)")
    attack_chain_id: str = Field(description="ID of the related AttackPath (e.g., AP-001)")
    title: str = Field(description="Title of the remediation plan")
    category: str = Field(description="Category (e.g., Identity & Access Management, Network Security)")
    priority: str = Field(description="Priority (Immediate, High, Medium, Low)")
    affected_assets: List[str] = Field(description="List of affected asset IDs")
    estimated_effort: str = Field(description="Estimated engineering effort")
    implementation_time: str = Field(description="Expected time to implement")
    implementation_cost: str = Field(description="Expected cost or resource overhead")
    business_impact: str = Field(description="Impact to business operations during/after implementation")
    expected_risk_reduction: str = Field(description="Description of how this mitigates the risk")
    implementation_steps: List[str] = Field(description="Immediate, Short-Term, and Long-Term steps")
    rollback_steps: List[str] = Field(description="Rollback strategy if implementation fails")
    validation_steps: List[str] = Field(description="Validation checklist to ensure successful implementation")
    monitoring_steps: List[str] = Field(description="Monitoring checklist post-implementation")
    automation_possible: bool = Field(description="Indicates if the remediation can be fully automated")
    confidence_score: float = Field(description="Confidence score (0.0 to 1.0) in the recommendation")
    evidence_references: List[str] = Field(description="List of evidence references (e.g., EV-001) supporting this plan")

class RemediationSection(BaseModel):
    overall_remediation_priority: str = Field(default="Informational", description="Overall priority for the environment")
    quick_wins: List[str] = Field(default_factory=list, description="List of immediate, low-effort high-impact actions")
    critical_actions: List[str] = Field(default_factory=list, description="List of critical actions that must be taken immediately")
    implementation_phases: List[str] = Field(default_factory=list, description="High-level phases for rolling out all plans")
    remediation_plans: List[RemediationPlan] = Field(default_factory=list, description="Detailed remediation plans for each risk")
    implementation_summary: str = Field(default="No critical vulnerabilities require immediate remediation.", description="Summary of the remediation strategy")
    executive_summary: str = Field(default="No critical vulnerabilities require immediate remediation.", description="High-level executive summary of the remediation plan")
