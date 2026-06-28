"use client";

import { riskDistribution } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, ShieldAlert, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const riskTableData = [
  { id: "RSK-001", asset: "payment-gateway-prod", type: "RCE Vulnerability", impact: "High", priority: 99, status: "Open" },
  { id: "RSK-002", asset: "aws-admin-role", type: "Over-privileged IAM", impact: "High", priority: 95, status: "Open" },
  { id: "RSK-003", asset: "customer-db-replica", type: "Publicly Accessible", impact: "High", priority: 92, status: "In Progress" },
  { id: "RSK-004", asset: "frontend-repo", type: "Exposed Secret", impact: "Medium", priority: 75, status: "Open" },
];

const riskTrendData = [
  { name: 'Jan', critical: 12, high: 24 },
  { name: 'Feb', critical: 10, high: 20 },
  { name: 'Mar', critical: 8, high: 18 },
  { name: 'Apr', critical: 5, high: 12 },
];

import { use } from "react";
import { ProgressivePage } from "@/components/layout/ProgressivePage";

export default function RiskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProgressivePage analysisId={id} agentId={4}>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Risk Intelligence</h1>
        <p className="text-muted-foreground">Prioritized business risks based on exposure and attack path analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Critical Risks</h3>
          </div>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">High Risks</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="font-semibold">Avg Priority Score</h3>
          </div>
          <p className="text-3xl font-bold">78</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Activity className="h-5 w-5" />
            <h3 className="font-semibold">Risk Reduction</h3>
          </div>
          <p className="text-3xl font-bold">+14%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Risk Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} itemStyle={{ color: 'var(--foreground)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Risk Trends</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskTrendData}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="critical" stackId="a" fill="var(--destructive)" />
                <Bar dataKey="high" stackId="a" fill="var(--chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Top Prioritized Risks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Impact</th>
                <th className="px-4 py-3">Priority Score</th>
                <th className="px-4 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {riskTableData.map((risk) => (
                <tr key={risk.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{risk.id}</td>
                  <td className="px-4 py-3">{risk.asset}</td>
                  <td className="px-4 py-3">{risk.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.impact === 'High' ? 'bg-destructive/20 text-destructive' : 'bg-orange-500/20 text-orange-500'}`}>
                      {risk.impact}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-destructive h-2 rounded-full" style={{ width: `${risk.priority}%` }}></div>
                      </div>
                      <span className="font-bold">{risk.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{risk.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </ProgressivePage>
  );
}
