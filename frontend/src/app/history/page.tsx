"use client";

import { useAnalysisStore } from "@/store/analysis-store";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Shield, Target, PlayCircle, Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const analyses = useAnalysisStore(state => state.analyses);
  const deleteAnalysis = useAnalysisStore(state => state.deleteAnalysis);
  const router = useRouter();

  const analysisList = Object.values(analyses).sort((a, b) => b.startTime - a.startTime);

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">Analysis History</span>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search history..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
          />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {analysisList.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No analysis history found.</p>
              <button 
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Run your first analysis
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">Target URL</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Security Score</th>
                    <th className="px-6 py-4">Started</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisList.map((analysis) => (
                    <tr key={analysis.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {analysis.url}
                        <div className="text-xs font-mono text-muted-foreground mt-1 truncate w-48">ID: {analysis.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          analysis.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          analysis.status === 'running' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {analysis.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {analysis.kpis.securityScore}/100
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDistanceToNow(analysis.startTime, { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => router.push(`/analysis/${analysis.id}`)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors inline-block"
                          title="View Dashboard"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteAnalysis(analysis.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors inline-block"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
