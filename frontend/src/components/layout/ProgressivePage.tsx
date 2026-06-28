import { useAnalysisStore } from "@/store/analysis-store";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProgressivePage({ 
  analysisId, 
  agentId, 
  children 
}: { 
  analysisId: string; 
  agentId: number; 
  children: React.ReactNode 
}) {
  const analysis = useAnalysisStore(state => state.analyses[analysisId]);

  if (!analysis) return null;

  const agent = analysis.agents.find(a => a.agentId === agentId);
  const status = agent?.status || 'pending';

  if (status === 'pending' || status === 'running') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold">
          {status === 'pending' ? 'Waiting for previous agents to complete...' : `${agent?.name} is processing...`}
        </h2>
        <p className="text-muted-foreground text-sm">
          The dashboard will populate automatically as soon as intelligence is available.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
