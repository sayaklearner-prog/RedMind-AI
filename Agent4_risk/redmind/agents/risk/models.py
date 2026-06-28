from typing import List, Optional, Any
from pydantic import BaseModel, Field

class RiskAssessment(BaseModel):
    attack_chain_id: str = Field(description="Unique identifier for the attack chain")
    attack_title: str = Field(description="Human-readable title of the attack")
    severity: str = Field(description="Critical, High, Medium, Low, Informational")
    likelihood: int = Field(ge=0, le=100, description="Likelihood score from 0 to 100")
    business_impact: str = Field(description="Description of the potential business impact")
    attack_complexity: str = Field(description="Low, Medium, or High")
    required_privileges: str = Field(description="None, User, or Admin")
    user_interaction: bool = Field(description="Whether user interaction is required")
    detection_difficulty: str = Field(description="Low, Medium, or High")
    affected_assets: List[str] = Field(default_factory=list, description="List of assets affected in this path")
    critical_assets: List[str] = Field(default_factory=list, description="List of specifically critical assets affected")
    mitre_attack: List[str] = Field(default_factory=list, description="Mapped MITRE ATT&CK techniques")
    owasp: List[str] = Field(default_factory=list, description="Mapped OWASP categories")
    cwe: List[str] = Field(default_factory=list, description="Mapped CWE categories")
    evidence_references: List[str] = Field(default_factory=list, description="References to supporting evidence, recon, or exposure")
    reasoning: str = Field(description="Explain WHY this attack path received its ranking")
    confidence_score: int = Field(ge=0, le=100, description="Confidence in this assessment (0-100)")

class RiskSection(BaseModel):
    overall_risk_score: Optional[int] = Field(default=0, ge=0, le=100, description="Overall risk score for the environment")
    security_posture: Optional[str] = Field(default="No significant exposure on the internet.", description="High-level description of the security posture")
    executive_summary: Optional[str] = Field(default="No critical risks identified.", description="Summary suitable for executive stakeholders")
    technical_summary: Optional[str] = Field(default="No technical vulnerabilities found.", description="Detailed technical summary of the risks")
    highest_priority_attack: Any = Field(default=None, description="The attack_chain_id of the most critical attack path")
    top_5_risks: List[str] = Field(default_factory=list, description="List of up to 5 top priority attack_chain_ids")
    risk_assessments: List[RiskAssessment] = Field(default_factory=list, description="Detailed assessment of each attack path")
