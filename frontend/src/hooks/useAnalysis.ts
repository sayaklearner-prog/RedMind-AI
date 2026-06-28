import { useMutation, useQuery } from "@tanstack/react-query";
import { useAnalysisStore } from "@/store/analysis-store";
import { useEffect, useState } from "react";

export const useStartAnalysis = () => {
  const createAnalysis = useAnalysisStore((state) => state.createAnalysis);

  return useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.message || "Failed to start analysis");
      }
      return res.json(); // { analysis_id, status }
    },
    onSuccess: (data, url) => {
      createAnalysis(data.analysis_id, url);
    },
  });
};

const AGENT_MAPPING: Record<string, number> = {
  "Agent 1: Recon": 1,
  "Agent 2: Exposure": 2,
  "Agent 3: Attack Path": 3,
  "Agent 4: Risk": 4,
  "Agent 5: Remediation": 5,
  "Agent 6: Executive": 6
};

export const useAnalysisStatus = (analysisId: string) => {
  const [error, setError] = useState<string | null>(null);
  const updateAnalysisStatus = useAnalysisStore((state) => state.updateAnalysisStatus);
  const updateAgentStatus = useAnalysisStore((state) => state.updateAgentStatus);
  const addAgentLog = useAnalysisStore((state) => state.addAgentLog);
  const updateKPIs = useAnalysisStore((state) => state.updateKPIs);
  const updateIntelligence = useAnalysisStore((state) => state.updateIntelligence);

  useEffect(() => {
    if (!analysisId) return;

    const eventSource = new EventSource(`/api/analysis/${analysisId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { type, data, scan, intelligence } = payload;
        
        if (type === "INITIAL_STATE" || type === "UPDATE") {
           if (scan) {
              updateAnalysisStatus(analysisId, scan.status);
              const pipeline = scan.pipeline || [];
              pipeline.forEach((p: any) => {
                 const agentId = AGENT_MAPPING[p.agent] ?? 0;
                 updateAgentStatus(analysisId, agentId, p.status);
              });
           }
           
           if (intelligence) {
              let totalAssets = 0;
              if (intelligence.recon?.asset_summary) {
                 const summary = intelligence.recon.asset_summary;
                 totalAssets = (summary.domains?.length || 0) + 
                               (summary.subdomains?.length || 0) + 
                               (summary.applications?.length || 0) + 
                               (summary.api_endpoints?.length || 0) + 
                               (summary.documents?.length || 0);
              }
              
              let exposedAssets = 0;
              if (intelligence.exposure?.asset_exposure) {
                 const exposure = intelligence.exposure.asset_exposure;
                 exposedAssets = (exposure.public_domains?.length || 0) + 
                                 (exposure.public_subdomains?.length || 0) + 
                                 (exposure.applications?.length || 0) + 
                                 (exposure.api_endpoints?.length || 0) + 
                                 (exposure.admin_interfaces?.length || 0) +
                                 (exposure.public_documents?.length || 0) +
                                 (exposure.repositories?.length || 0);
              }
              
              let criticalRisks = 0;
              if (intelligence.risk?.top_5_risks) {
                 criticalRisks = intelligence.risk.top_5_risks.length;
              }
              
              let openRemediations = 0;
              if (intelligence.remediation?.remediation_plans) {
                 openRemediations = intelligence.remediation.remediation_plans.length;
              }
              
              const securityScore = Math.max(0, 100 - (criticalRisks * 5) - (exposedAssets * 2));
              
              updateKPIs(analysisId, { totalAssets, exposedAssets, criticalRisks, openRemediations, securityScore });
              updateIntelligence(analysisId, intelligence);
           }
        }
        
        if (type === "UPDATE") {
           if (data.event_type === "AGENT_STARTED") {
              const agentId = AGENT_MAPPING[data.agent] ?? 0;
              updateAgentStatus(analysisId, agentId, "running");
              addAgentLog(analysisId, agentId, `Started ${data.agent}...`);
           } else if (data.event_type === "AGENT_COMPLETED") {
              const agentId = AGENT_MAPPING[data.agent] ?? 0;
              updateAgentStatus(analysisId, agentId, "completed");
              addAgentLog(analysisId, agentId, `Completed ${data.agent} with ${data.records} records.`);
           } else if (data.event_type === "SCAN_FAILED") {
              updateAnalysisStatus(analysisId, "failed");
              setError(data.error);
              eventSource.close();
           } else if (data.event_type === "SCAN_COMPLETED") {
              updateAnalysisStatus(analysisId, "completed");
              eventSource.close();
           }
        }
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
      setError("Lost connection to analysis stream");
    };

    return () => {
      eventSource.close();
    };
  }, [analysisId, updateAnalysisStatus, updateAgentStatus, addAgentLog, updateKPIs, updateIntelligence]);

  return { error };
};
