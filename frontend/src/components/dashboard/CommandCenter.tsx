"use client";

import { useAnalysisStore } from "@/store/analysis-store";
import { motion } from "framer-motion";
import { Shield, Target, AlertTriangle, Activity, Wrench, CheckCircle2, CircleDashed } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { recentActivity, riskDistribution } from "@/lib/mock-data";

function KPICard({ title, value, icon: Icon, trend, colorClass }: any) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-muted ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 font-medium">{trend}</span>
          <span className="ml-2 text-muted-foreground">vs last week</span>
        </div>
      )}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl"></div>
    </div>
  );
}

export function CommandCenter({ analysisId }: { analysisId: string }) {
  const analysis = useAnalysisStore(state => state.analyses[analysisId]);

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Command Center</h1>
        <p className="text-muted-foreground">Real-time intelligence across your attack surface.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KPICard title="Security Posture" value={`${analysis.kpis.securityScore}/100`} icon={Shield} trend={analysis.status === 'completed' ? "+2%" : undefined} colorClass="text-primary" />
        <KPICard title="Total Assets" value={analysis.kpis.totalAssets.toLocaleString()} icon={Target} colorClass="text-blue-500" />
        <KPICard title="Exposed Assets" value={analysis.kpis.exposedAssets} icon={AlertTriangle} colorClass="text-orange-500" />
        <KPICard title="Active Attack Paths" value={Math.floor(analysis.kpis.criticalRisks * 1.5)} icon={Activity} trend={analysis.status === 'completed' ? "-1" : undefined} colorClass="text-destructive" />
        <KPICard title="Critical Risks" value={analysis.kpis.criticalRisks} icon={AlertTriangle} colorClass="text-destructive" />
        <KPICard title="Open Remediations" value={analysis.kpis.openRemediations} icon={Wrench} trend={analysis.status === 'completed' ? "-5" : undefined} colorClass="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Distribution Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Risk Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            {riskDistribution.map((risk) => (
              <div key={risk.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: risk.color }}></span>
                <span className="text-muted-foreground">{risk.name} ({risk.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Pipeline Status */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Intelligence Pipeline</h3>
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Processing
            </span>
          </div>
          
          <div className="space-y-4">
            {analysis.agents.map((agent, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={agent.name} 
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
              >
                <div className="flex items-center gap-4">
                  {agent.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : agent.status === "running" ? (
                    <Activity className="h-5 w-5 animate-pulse text-primary" />
                  ) : agent.status === "failed" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.status === "pending" ? "Waiting..." : agent.status === "running" ? "Processing..." : "Done"}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {agent.status === 'completed' ? "Completed" : "-"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Activity Feed */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Live Intelligence Feed</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={activity.id} 
              className="flex items-start gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0"
            >
              <div className={`mt-0.5 flex h-2 w-2 shrink-0 rounded-full ${
                activity.type === 'risk' ? 'bg-destructive' :
                activity.type === 'exposure' ? 'bg-orange-500' :
                activity.type === 'path' ? 'bg-primary' : 'bg-green-500'
              }`} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
