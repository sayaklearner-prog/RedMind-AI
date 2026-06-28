import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Activity, GitBranch, Server, TerminalSquare } from "lucide-react";

export function DeveloperTab() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <TerminalSquare className="w-5 h-5 text-primary" />
          Developer Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Advanced configuration and environment details for development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Debug Mode</CardTitle>
            <CardDescription>
              Toggle advanced debugging tools and verbosity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Debug Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Shows raw JSON payloads in the UI.
                </p>
              </div>
              <Switch 
                checked={settings.developer.debugMode}
                onCheckedChange={(checked) => 
                  updateSettings({ developer: { ...settings.developer, debugMode: checked }})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verbose Logging</Label>
                <p className="text-xs text-muted-foreground">
                  Writes all API calls to browser console.
                </p>
              </div>
              <Switch 
                checked={settings.developer.verboseLogging}
                onCheckedChange={(checked) => 
                  updateSettings({ developer: { ...settings.developer, verboseLogging: checked }})
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              System Health
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Operational</Badge>
            </CardTitle>
            <CardDescription>
              Status of backend services and integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Server className="w-4 h-4" /> API Backend
              </span>
              <span className="font-medium text-emerald-500">Online ({settings.developer.backendUrl})</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> AI Provider (Featherless)
              </span>
              <span className="font-medium text-emerald-500">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> Crawler (Firecrawl)
              </span>
              <span className="font-medium text-emerald-500">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment Information</CardTitle>
          <CardDescription>
            Current build and deployment parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Environment</p>
              <p className="font-mono text-sm">{settings.developer.environment}</p>
            </div>
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Frontend</p>
              <p className="font-mono text-sm">v{settings.developer.frontendVersion}</p>
            </div>
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Backend</p>
              <p className="font-mono text-sm">v{settings.developer.backendVersion}</p>
            </div>
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg border flex flex-col">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Branch</p>
              <p className="font-mono text-sm flex items-center gap-1">
                <GitBranch className="w-3 h-3" /> {settings.developer.currentBranch}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
