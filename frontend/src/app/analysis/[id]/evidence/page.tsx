"use client";

import { use } from "react";
import { ProgressivePage } from "@/components/layout/ProgressivePage";
import { useAnalysisStore } from "@/store/analysis-store";
import { Server, Globe, FileText, Database } from "lucide-react";

export default function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const analysis = useAnalysisStore(state => state.analyses[id]);

  if (!analysis) return null;

  return (
    <ProgressivePage analysisId={id} agentId={0}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence Collection</h1>
          <p className="text-muted-foreground">Raw data collected from {analysis.url}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-lg">DNS & WHOIS</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground font-mono bg-muted/30 p-4 rounded-md">
              <p>Domain: {analysis.url}</p>
              <p>A Record: 192.168.1.100</p>
              <p>MX: mail.{analysis.url}</p>
              <p>Nameservers: ns1.aws.com, ns2.aws.com</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-lg">HTTP Headers</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground font-mono bg-muted/30 p-4 rounded-md">
              <p>Server: nginx/1.18.0</p>
              <p>X-Powered-By: PHP/8.1</p>
              <p>Strict-Transport-Security: max-age=31536000</p>
            </div>
          </div>
        </div>
      </div>
    </ProgressivePage>
  );
}
