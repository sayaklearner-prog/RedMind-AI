import { useAnalysisStore } from "@/store/analysis-store";
import { CheckCircle2, CircleDashed, Activity, ArrowRight, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function ActivityPanel({ analysisId }: { analysisId: string }) {
  const analysis = useAnalysisStore(state => state.analyses[analysisId]);

  if (!analysis) return null;

  return (
    <div className="w-80 h-full bg-card border-l border-border/50 flex flex-col hidden lg:flex">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-lg">Live Pipeline</h3>
        <p className="text-sm text-muted-foreground">{analysis.status === 'running' ? 'Scanning...' : analysis.status}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {analysis.agents.map((agent, index) => (
          <div key={agent.agentId} className="space-y-2">
            <div className="flex items-center gap-3">
              {agent.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : agent.status === "running" ? (
                <Activity className="h-4 w-4 animate-pulse text-primary" />
              ) : agent.status === "failed" ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CircleDashed className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${agent.status !== 'pending' ? 'text-foreground' : 'text-muted-foreground'}`}>
                {agent.name}
              </span>
            </div>
            
            {agent.logs.length > 0 && (
              <div className="pl-7 space-y-1">
                {agent.logs.slice(-3).map((log, i) => (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className="text-xs text-muted-foreground truncate"
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
