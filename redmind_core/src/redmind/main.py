import asyncio
import logging
import inspect
from src.redmind.models.pipeline_state import PipelineState

from src.redmind.agents.evidence_collection.core import EvidenceCollectionAgent
from src.redmind.agents.recon_intelligence.core import ReconIntelligenceAgent
from src.redmind.agents.exposure.core import ExposureAgent
from src.redmind.agents.attack_path.core import AttackPathAgent
from src.redmind.agents.risk.core import RiskAssessmentAgent
from src.redmind.agents.remediation.core import RemediationPlanningAgent
from src.redmind.agents.report.core import ReportGenerationAgent


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("RedMindPipeline")

import json
original_loads = json.loads
def patched_loads(s, *args, **kwargs):
    if isinstance(s, str):
        s = s.strip()
        if s.startswith("```json"): s = s[7:]
        elif s.startswith("```"): s = s[3:]
        if s.endswith("```"): s = s[:-3]
        s = s.strip()
    return original_loads(s, *args, **kwargs)
json.loads = patched_loads

async def _run_agent(agent_name: str, agent_instance, state: PipelineState) -> PipelineState:
    logger.info(f"--- Running {agent_name} ---")
    method = getattr(agent_instance, 'execute', getattr(agent_instance, 'analyze', None))
    if not method:
        logger.error(f"No executable method found on {agent_name}")
        return state
    
    if inspect.iscoroutinefunction(method):
        new_state = await method(state)
    else:
        # For non-async methods, we run them in an executor or just call them if they are fast.
        # Since this is a test pipeline, we'll just call it directly.
        new_state = method(state)
        
    return new_state

async def run_redmind_pipeline(target: str):
    logger.info(f"--- Starting RedMind AI Pipeline (v1.0) for {target} ---")
    
    state = PipelineState(scan_metadata={"target": target})
    logger.info("--- Running Agent 0: Evidence Collection ---")
    try:
        agent0 = EvidenceCollectionAgent(target)
        evidence_output = await agent0.collect_evidence()
        state.evidence = evidence_output.model_dump(mode='json')
    except Exception as e:
        logger.error(f"Fatal error in Agent 0: {e}")

    agents = [
        ("Agent 1: Recon Intelligence", ReconIntelligenceAgent()),
        ("Agent 2: Exposure Analysis", ExposureAgent()),
        ("Agent 3: Attack Path Analysis", AttackPathAgent()),
        ("Agent 4: Risk Assessment", RiskAssessmentAgent()),
        ("Agent 5: Remediation Planning", RemediationPlanningAgent()),
        ("Agent 6: Report Generation", ReportGenerationAgent())
    ]
    
    for name, agent in agents:
        try:
            state = await _run_agent(name, agent, state)
        except Exception as e:
            logger.error(f"Fatal error in {name}: {e}")
            break
            
    logger.info("--- Pipeline Execution Complete ---")
    if state.report:
        if isinstance(state.report, dict):
            logger.info("Final Report generated with validation errors (returning dict).")
            with open("mock_report.json", "w") as f:
                json.dump(state.report, f, indent=2)
        else:
            logger.info(f"Final Report Generated: {state.report.report_id}")
    else:
        logger.warning("No report was generated.")

if __name__ == "__main__":
    asyncio.run(run_redmind_pipeline("https://developer.mozilla.org"))
