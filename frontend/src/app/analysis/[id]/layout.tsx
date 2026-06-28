"use client";

import { usePathname, useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ActivityPanel } from "@/components/layout/ActivityPanel";
import { useEffect } from "react";
import { useAnalysisStatus } from "@/hooks/useAnalysis";
import { CommandPalette } from "@/components/CommandPalette";

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const analysisId = params.id as string;
  
  // Start polling status when the layout mounts
  useAnalysisStatus(analysisId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Sidebar analysisId={analysisId} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header analysisId={analysisId} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 p-6">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>
      <ActivityPanel analysisId={analysisId} />
      <CommandPalette />
    </div>
  );
}
