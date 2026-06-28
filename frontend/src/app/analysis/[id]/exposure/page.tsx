"use client";

import { use } from "react";
import { ShieldAlert, Key, FileCode, LockOpen } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressivePage } from "@/components/layout/ProgressivePage";

export default function ExposurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProgressivePage analysisId={id} agentId={2}>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Exposure Intelligence</h1>
        <p className="text-muted-foreground">Identified secrets, misconfigurations, and vulnerabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: "Exposed Secrets", value: "14", icon: Key, color: "text-destructive" },
          { name: "Misconfigurations", value: "86", icon: FileCode, color: "text-orange-500" },
          { name: "Open Ports", value: "24", icon: LockOpen, color: "text-yellow-500" },
          { name: "Total Exposures", value: "124", icon: ShieldAlert, color: "text-primary" },
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
        <h3 className="mb-4 text-lg font-semibold">Exposure Findings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Type</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Value (Masked)</th>
                <th className="px-4 py-3 rounded-tr-lg">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="px-4 py-3 font-medium text-destructive">AWS Secret Key</td>
                <td className="px-4 py-3">frontend-repo</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">AKIAIOSFODNN7E****</td>
                <td className="px-4 py-3">99%</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-4 py-3 font-medium text-orange-500">Public S3 Bucket</td>
                <td className="px-4 py-3">customer-assets-prod</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">s3://customer-assets-prod</td>
                <td className="px-4 py-3">95%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </ProgressivePage>
  );
}
