"use client";

import { Bell, Search, Shield, Zap, PlayCircle, Loader2 } from "lucide-react";
import { useAnalysisStore } from "@/store/analysis-store";

export function Header({ analysisId }: { analysisId: string }) {
  const analysis = useAnalysisStore((state) => state.analyses[analysisId]);

  if (!analysis) return null;

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search Intelligence Graph (Ctrl+K)..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm bg-muted/30 px-4 py-2 rounded-lg border border-border/50">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              {analysis.status === 'running' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${analysis.status === 'running' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
            </span>
            <span className="text-muted-foreground font-medium">{analysis.status === 'running' ? 'Scan Active' : 'Idle'}</span>
          </div>
          
          <div className="h-4 w-px bg-border"></div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Posture:</span>
            <span className="font-bold text-foreground">{analysis.kpis.securityScore}/100</span>
          </div>

          <div className="h-4 w-px bg-border"></div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground">Risk:</span>
            <span className={`font-bold ${analysis.kpis.criticalRisks > 0 ? 'text-destructive' : 'text-green-500'}`}>
              {analysis.kpis.criticalRisks > 0 ? 'CRITICAL' : 'SECURE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive border border-background"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
