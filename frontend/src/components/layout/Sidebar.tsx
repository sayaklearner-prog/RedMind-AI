"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Network,
  Globe,
  ShieldAlert,
  Route,
  Activity,
  Wrench,
  Briefcase,
  FileText,
  Settings,
  Key,
  Blocks,
  Bell,
  User,
} from "lucide-react";

export function Sidebar({ analysisId }: { analysisId: string }) {
  const pathname = usePathname();

  const bottomNav = [
    { name: "Settings", href: `/analysis/${analysisId}/settings`, icon: Settings },
    { name: "API Keys", href: `/analysis/${analysisId}/settings?tab=api`, icon: Key },
    { name: "Integrations", href: `/analysis/${analysisId}/settings?tab=integrations`, icon: Blocks },
  ];

  const mainNav = [
    { name: "Command Center", href: `/analysis/${analysisId}`, icon: LayoutDashboard },
    { name: "Evidence (Agent 0)", href: `/analysis/${analysisId}/evidence`, icon: FileText },
    { name: "Recon (Agent 1)", href: `/analysis/${analysisId}/recon`, icon: Globe },
    { name: "Exposure (Agent 2)", href: `/analysis/${analysisId}/exposure`, icon: ShieldAlert },
    { name: "Attack Paths (Agent 3)", href: `/analysis/${analysisId}/attack-paths`, icon: Route },
    { name: "Risk (Agent 4)", href: `/analysis/${analysisId}/risk`, icon: Activity },
    { name: "Remediation (Agent 5)", href: `/analysis/${analysisId}/remediation`, icon: Wrench },
    { name: "Report (Agent 6)", href: `/analysis/${analysisId}/report`, icon: Briefcase },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border/50 text-sidebar-foreground">
      <div className="flex h-14 items-center px-6 font-bold text-lg tracking-tight text-primary">
        <ShieldAlert className="mr-2 h-5 w-5" />
        <Link href="/">RedMind AI</Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border/50 p-4">
        <nav className="space-y-1">
          {bottomNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <item.icon
                className="mr-3 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-sidebar-accent-foreground"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
          <div className="mt-4 flex items-center px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Administrator</p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
