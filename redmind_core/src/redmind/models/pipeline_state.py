from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

# We import the strict sections as they are developed by each agent.
# Evidence is just a generic dict for now until we strongly type the Evidence Collector output.
from src.redmind.models.recon import ReconnaissanceSection
from src.redmind.agents.exposure.models import ExposureSection
from src.redmind.agents.attack_path.models import AttackPathSection
from src.redmind.agents.risk.models import RiskSection
from src.redmind.agents.remediation.models import RemediationSection
from src.redmind.agents.report.models import ReportSection

class PipelineState(BaseModel):
    """
    The shared state passed sequentially between all RedMind AI Agents.
    Agents only mutate their specific section.
    """
    scan_metadata: Dict[str, Any] = Field(default_factory=lambda: {"execution_metrics": {}})
    
    # Populated by Agent 0: Evidence Collection
    evidence: Dict[str, Any] = Field(default_factory=dict)
    
    # Populated by Agent 1: Recon Intelligence
    recon: Optional[ReconnaissanceSection] = None
    
    # Populated by Agent 2: Exposure Analysis
    exposure: Optional[ExposureSection] = None
    
    # Populated by Agent 3: Attack Path
    attack_paths: Optional[AttackPathSection] = None
    
    # Populated by Agent 4: Risk Assessment
    risk: Optional['RiskSection'] = None
    
    # Populated by Agent 5: Remediation
    remediation: Optional[RemediationSection] = None
    
    # Populated by Agent 6: Executive Reporting
    report: Optional[ReportSection] = None
