"use client";

import { use } from "react";
import { Wrench, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressivePage } from "@/components/layout/ProgressivePage";

export default function RemediationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProgressivePage analysisId={id} agentId={5}>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Remediation Intelligence</h1>
        <p className="text-muted-foreground">Prioritized fixes with highest ROI and blast radius reduction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Open Tasks", value: "42", icon: Wrench, color: "text-primary" },
          { name: "In Progress", value: "8", icon: Clock, color: "text-blue-500" },
          { name: "Overdue", value: "3", icon: AlertCircle, color: "text-destructive" },
          { name: "Completed", value: "156", icon: CheckCircle, color: "text-green-500" },
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
        <h3 className="mb-4 text-lg font-semibold">Remediation Kanban (Highest ROI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-bold mb-4 flex items-center justify-between">To Do <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xs">2</span></h4>
            <div className="space-y-3">
              <div className="bg-card p-3 rounded shadow-sm border border-border">
                <p className="text-sm font-medium">Rotate Exposed AWS Key</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-destructive font-bold">CRITICAL</span>
                  <span className="text-muted-foreground">Frontend Team</span>
                </div>
              </div>
              <div className="bg-card p-3 rounded shadow-sm border border-border">
                <p className="text-sm font-medium">Restrict S3 Bucket Access</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-orange-500 font-bold">HIGH</span>
                  <span className="text-muted-foreground">DevOps Team</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-bold mb-4 flex items-center justify-between">In Progress <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xs">1</span></h4>
            <div className="space-y-3">
              <div className="bg-card p-3 rounded shadow-sm border border-border border-l-4 border-l-blue-500">
                <p className="text-sm font-medium">Patch OpenSSL Vulnerability</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-orange-500 font-bold">HIGH</span>
                  <span className="text-muted-foreground">Infra Team</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-bold mb-4 flex items-center justify-between">Done <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xs">1</span></h4>
            <div className="space-y-3">
              <div className="bg-card p-3 rounded shadow-sm border border-border border-l-4 border-l-green-500 opacity-70">
                <p className="text-sm font-medium line-through text-muted-foreground">Remove Default Password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProgressivePage>
  );
}
