"use client";

import { use } from "react";
import { Globe, Server, Database, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressivePage } from "@/components/layout/ProgressivePage";

export default function ReconPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProgressivePage analysisId={id} agentId={1}>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recon Intelligence</h1>
        <p className="text-muted-foreground">Comprehensive inventory of your external and internal attack surface.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Domains", value: "342", icon: Globe, color: "text-blue-500" },
          { name: "Cloud Assets", value: "1,204", icon: Cloud, color: "text-primary" },
          { name: "Servers", value: "45", icon: Server, color: "text-purple-500" },
          { name: "Databases", value: "12", icon: Database, color: "text-orange-500" },
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
        <h3 className="mb-4 text-lg font-semibold">Discovered Assets</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
          <p>Asset inventory table will be populated here.</p>
        </div>
      </div>
    </div>
    </ProgressivePage>
  );
}
