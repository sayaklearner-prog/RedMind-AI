"use client";

import { useAnalysisStore } from "@/store/analysis-store";
import { Shield, Activity, BarChart, Server, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ObservabilityPage() {
  const analyses = useAnalysisStore(state => state.analyses);
  const totalScans = Object.keys(analyses).length;
  const completedScans = Object.values(analyses).filter(a => a.status === 'completed').length;
  
  const successRate = totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0;

  const mockLatencyData = [
    { name: 'Agent 0', latency: 400 },
    { name: 'Agent 1', latency: 3000 },
    { name: 'Agent 2', latency: 2400 },
    { name: 'Agent 3', latency: 5000 },
    { name: 'Agent 4', latency: 1200 },
    { name: 'Agent 5', latency: 800 },
    { name: 'Agent 6', latency: 1500 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-bold">Observability Dashboard</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Platform Telemetry</h1>
          <p className="text-muted-foreground">Monitor agent performance, LLM token usage, and system health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-primary mb-2">
              <BarChart className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Pipeline Success Rate</h3>
            </div>
            <p className="text-3xl font-bold">{successRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{completedScans} out of {totalScans} completed</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Zap className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Avg Token Consumption</h3>
            </div>
            <p className="text-3xl font-bold">142k</p>
            <p className="text-xs text-muted-foreground mt-1">Per analysis run</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Server className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Avg Analysis Time</h3>
            </div>
            <p className="text-3xl font-bold">28s</p>
            <p className="text-xs text-muted-foreground mt-1">Across all 7 agents</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Shield className="h-5 w-5" />
              <h3 className="font-semibold text-sm">LLM Cost Estimate</h3>
            </div>
            <p className="text-3xl font-bold">$0.84</p>
            <p className="text-xs text-muted-foreground mt-1">Total API cost today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Agent Latency (ms)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar data={mockLatencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="latency" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </RechartsBar>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <h3 className="mb-4 text-lg font-semibold">System Logs</h3>
            <div className="flex-1 bg-muted/30 rounded-lg border border-border/50 p-4 font-mono text-xs text-muted-foreground overflow-y-auto space-y-2 h-[300px]">
              <p>[INFO] Engine started on port 8000</p>
              <p>[INFO] Connected to primary Redis cluster</p>
              <p className="text-destructive">[WARN] Rate limit threshold approaching for OpenAI API</p>
              <p>[INFO] Agent 3 (Attack Paths) completed in 5021ms</p>
              <p>[INFO] Triggered garbage collection (freed 412MB)</p>
              <p>[INFO] Cached 12 recon artifacts</p>
              <p>[INFO] Analysis a8f9-b31c completed successfully</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
