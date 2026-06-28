"use client";

import { use } from "react";
import { Briefcase, TrendingUp, ShieldCheck, PieChart as PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressivePage } from "@/components/layout/ProgressivePage";
import { useAnalysisStore } from "@/store/analysis-store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const analysis = useAnalysisStore((state) => state.analyses[id]);
  
  const report = analysis?.intelligence?.report;
  const kpis = analysis?.kpis;

  return (
    <ProgressivePage analysisId={id} agentId={6}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Executive Presentation View</h1>
            <p className="text-muted-foreground">Boardroom-ready metrics and security posture summary.</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Export Board Report PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col items-center justify-center text-center"
          >
            <div className="h-32 w-32 rounded-full border-8 border-primary flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-bold">{kpis?.securityScore || 0}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Overall Security Health</h3>
            <p className="text-sm text-muted-foreground">Dynamically calculated based on critical risks and exposure.</p>
          </motion.div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Total Assets", value: kpis?.totalAssets || 0, icon: TrendingUp, color: "text-blue-500" },
              { name: "Exposed Assets", value: kpis?.exposedAssets || 0, icon: PieChartIcon, color: "text-orange-500" },
              { name: "Critical Risks", value: kpis?.criticalRisks || 0, icon: ShieldCheck, color: "text-red-500" },
              { name: "Open Remediations", value: kpis?.openRemediations || 0, icon: Briefcase, color: "text-yellow-500" },
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.name} 
                className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
              >
                <div className={`flex items-center gap-2 mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <p className="text-4xl font-bold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Markdown Report Section */}
        {report ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Executive Summary</h2>
              <div className="prose prose-invert max-w-none prose-h3:text-primary prose-a:text-blue-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.executive_report}</ReactMarkdown>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Technical Details</h2>
              <div className="prose prose-invert max-w-none prose-h3:text-primary prose-a:text-blue-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.technical_report}</ReactMarkdown>
              </div>
            </div>
            
            {report.developer_checklist && (
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Developer Checklist</h2>
                <div className="prose prose-invert max-w-none prose-h3:text-primary prose-a:text-blue-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.developer_checklist}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {report.soc_summary && (
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 border-b pb-4">SOC Summary</h2>
                <div className="prose prose-invert max-w-none prose-h3:text-primary prose-a:text-blue-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{report.soc_summary}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
            <p className="text-muted-foreground">Waiting for Agent 6 to generate intelligence reports...</p>
          </div>
        )}
      </div>
    </ProgressivePage>
  );
}
