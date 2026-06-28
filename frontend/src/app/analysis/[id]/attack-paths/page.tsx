"use client";

import { use } from "react";
import { Route, Target, Zap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressivePage } from "@/components/layout/ProgressivePage";

export default function AttackPathsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProgressivePage analysisId={id} agentId={3}>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Attack Path Intelligence</h1>
        <p className="text-muted-foreground">Discovered kill chains, choke points, and blast radius calculations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Active Paths", value: "18", icon: Route, color: "text-destructive" },
          { name: "Choke Points", value: "3", icon: Target, color: "text-orange-500" },
          { name: "Max Blast Radius", value: "4.2k", icon: Zap, color: "text-purple-500" },
          { name: "Compromised", value: "0", icon: ShieldAlert, color: "text-green-500" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.name} 
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className={`flex items-center gap-2 mb-2 ${item.color}`}>
              <item.icon className="h-5 w-5" />
              <h3 className="font-semibold">{item.name}</h3>
            </div>
            <p className="text-3xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Critical Attack Paths</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-border/50 p-4 bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-destructive/20 text-destructive rounded font-bold text-xs">CRITICAL</span>
              <span className="font-medium text-sm">Exposed Secret to RDS Instance</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto">
              <span className="shrink-0 text-orange-500">Public GitHub Repo</span>
              <span>→</span>
              <span className="shrink-0 text-red-400">AWS Secret Key</span>
              <span>→</span>
              <span className="shrink-0 text-blue-400">EC2 Admin Role</span>
              <span>→</span>
              <span className="shrink-0 font-bold text-destructive">Customer RDS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProgressivePage>
  );
}
