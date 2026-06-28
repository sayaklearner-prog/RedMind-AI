"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Activity, ArrowRight, XCircle } from "lucide-react";
import { useIntelligenceStore } from "@/store/intelligence-store";

export default function PipelinePage() {
  const { agentStatuses } = useIntelligenceStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Pipeline</h1>
        <p className="text-muted-foreground">Real-time visualization of the multi-agent execution pipeline.</p>
      </div>

      <div className="relative mt-12 flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-4">
        {agentStatuses.map((agent, index) => {
          const isLast = index === agentStatuses.length - 1;
          const isActive = agent.status === "processing";
          const isComplete = agent.status === "completed";

          return (
            <div key={agent.agent} className="relative flex flex-col items-center flex-1 w-full">
              {/* Agent Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative z-10 w-full max-w-[200px] rounded-xl border p-6 shadow-lg backdrop-blur-sm transition-all ${
                  isActive 
                    ? "border-primary bg-primary/10 shadow-primary/20 scale-105" 
                    : isComplete 
                      ? "border-green-500/50 bg-green-500/5" 
                      : "border-border bg-card"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {isComplete ? (
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  ) : isActive ? (
                    <Activity className="h-10 w-10 animate-pulse text-primary" />
                  ) : (
                    <CircleDashed className="h-10 w-10 text-muted-foreground" />
                  )}
                  
                  <div>
                    <h3 className="font-bold">{agent.agent.split(": ")[1]}</h3>
                    <p className="text-xs text-muted-foreground">Agent {index + 1}</p>
                  </div>
                  
                  <div className="w-full rounded-md bg-muted p-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize font-medium">{agent.status}</span>
                    </div>
                    {isComplete && (
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Records:</span>
                        <span className="font-medium">{(agent.records || 0).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Connecting Line (Desktop) */}
              {!isLast && (
                <div className="hidden lg:block absolute top-1/2 left-[calc(50%+100px)] w-[calc(100%-100px)] -translate-y-1/2 z-0">
                  <div className={`h-1 w-full ${isComplete ? "bg-green-500/50" : "bg-border"} relative`}>
                    {isActive && (
                      <motion.div 
                        className="absolute h-full bg-primary" 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <ArrowRight className={`absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isComplete ? "text-green-500/50" : "text-border"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
