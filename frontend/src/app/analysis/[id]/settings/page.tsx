"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Sliders, Bell, Cpu, Link, Download, Key, User, Info, TerminalSquare } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

// Placeholder imports for sub-components - we will create these next
import { GeneralTab } from "@/features/settings/components/GeneralTab";
import { AppearanceTab } from "@/features/settings/components/AppearanceTab";
import { DeveloperTab } from "@/features/settings/components/DeveloperTab";
import { PipelineTab } from "@/features/settings/components/PipelineTab";
import { AIProviderTab } from "@/features/settings/components/AIProviderTab";

export default function SettingsPage() {
  const { loadSettings, isLoading, isError } = useSettings();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "general";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-6">
          <Skeleton className="w-64 h-[400px]" />
          <Skeleton className="flex-1 h-[600px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-red-500">Settings Unavailable</h2>
        <p className="text-muted-foreground">We couldn't load your preferences.</p>
        <button 
          onClick={() => loadSettings()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your enterprise preferences, application behavior, and integrations.
        </p>
      </div>

      <Tabs 
        orientation="vertical" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col md:flex-row gap-8"
      >
        <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent p-0 space-y-1 items-start justify-start text-left">
          <TabsTrigger value="general" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Settings className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Sliders className="w-4 h-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Cpu className="w-4 h-4" /> Pipeline & Analysis
          </TabsTrigger>
          <TabsTrigger value="ai" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <User className="w-4 h-4" /> AI Provider
          </TabsTrigger>
          <TabsTrigger value="api" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Link className="w-4 h-4" /> API Configuration
          </TabsTrigger>
          <TabsTrigger value="export" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Download className="w-4 h-4" /> Export Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Key className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="developer" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <TerminalSquare className="w-4 h-4" /> Developer
          </TabsTrigger>
          <TabsTrigger value="about" className="w-full justify-start gap-2 data-[state=active]:bg-muted">
            <Info className="w-4 h-4" /> About
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-[500px]">
          <TabsContent value="general" className="m-0 focus-visible:outline-none">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="appearance" className="m-0 focus-visible:outline-none">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="pipeline" className="m-0 focus-visible:outline-none">
            <PipelineTab />
          </TabsContent>

          <TabsContent value="ai" className="m-0 focus-visible:outline-none">
            <AIProviderTab />
          </TabsContent>
          
          <TabsContent value="developer" className="m-0 focus-visible:outline-none">
            <DeveloperTab />
          </TabsContent>

          {/* Placeholders for tabs that just need structural UI for now */}
          <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium mb-4">Notifications</h3>
              <p className="text-muted-foreground">Notification preferences will go here.</p>
            </div>
          </TabsContent>

          <TabsContent value="api" className="m-0 focus-visible:outline-none">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium mb-4">API Configuration</h3>
              <p className="text-muted-foreground">API configuration details will go here.</p>
            </div>
          </TabsContent>

          <TabsContent value="export" className="m-0 focus-visible:outline-none">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium mb-4">Export Settings</h3>
              <p className="text-muted-foreground">Export preferences will go here.</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="m-0 focus-visible:outline-none">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium mb-4">Security</h3>
              <p className="text-muted-foreground">Security controls will go here.</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="m-0 focus-visible:outline-none">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-medium mb-4">About RedMind AI</h3>
              <p className="text-muted-foreground">Application information will go here.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
