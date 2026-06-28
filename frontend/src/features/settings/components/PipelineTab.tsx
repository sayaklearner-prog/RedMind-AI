import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function PipelineTab() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pipeline & Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Configure how RedMind executes multi-agent analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution Parameters</CardTitle>
          <CardDescription>
            Control the speed and depth of the analysis pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Default Scan Mode</Label>
            <Select 
              value={settings.pipeline.defaultScanMode}
              onValueChange={(value: any) => updateSettings({ pipeline: { ...settings.pipeline, defaultScanMode: value }})}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast (Recon & Exposure only)</SelectItem>
                <SelectItem value="standard">Standard (Full 7-Agent Pipeline)</SelectItem>
                <SelectItem value="deep">Deep (Extended timeouts & active crawling)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 pt-2">
            <div className="flex items-center justify-between">
              <Label>Max Concurrent Analyses</Label>
              <span className="text-sm font-medium">{settings.pipeline.maxConcurrentAnalyses}</span>
            </div>
            <Slider 
              value={[settings.pipeline.maxConcurrentAnalyses]}
              min={1} 
              max={10} 
              step={1}
              onValueChange={([value]) => updateSettings({ pipeline: { ...settings.pipeline, maxConcurrentAnalyses: value }})}
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of pipelines that can run simultaneously.
            </p>
          </div>

          <div className="grid gap-4 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label>Maximum Crawl Depth</Label>
              <span className="text-sm font-medium">{settings.pipeline.maxCrawlDepth}</span>
            </div>
            <Slider 
              value={[settings.pipeline.maxCrawlDepth]}
              min={1} 
              max={5} 
              step={1}
              onValueChange={([value]) => updateSettings({ pipeline: { ...settings.pipeline, maxCrawlDepth: value }})}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2 pt-4 border-t">
            <Label>Default Risk Threshold</Label>
            <Select 
              value={settings.pipeline.defaultRiskThreshold}
              onValueChange={(value: any) => updateSettings({ pipeline: { ...settings.pipeline, defaultRiskThreshold: value }})}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Report everything)</SelectItem>
                <SelectItem value="medium">Medium (Ignore informational)</SelectItem>
                <SelectItem value="high">High (Only Medium and above)</SelectItem>
                <SelectItem value="critical">Critical (Only Critical and High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavior</CardTitle>
          <CardDescription>
            Pipeline UI and automation settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Save Reports</Label>
              <p className="text-xs text-muted-foreground">Automatically save PDF reports upon pipeline completion.</p>
            </div>
            <Switch 
              checked={settings.pipeline.autoSaveReports}
              onCheckedChange={(checked) => updateSettings({ pipeline: { ...settings.pipeline, autoSaveReports: checked }})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Streaming Updates</Label>
              <p className="text-xs text-muted-foreground">Use Server-Sent Events to stream agent progress.</p>
            </div>
            <Switch 
              checked={settings.pipeline.streamingUpdates}
              onCheckedChange={(checked) => updateSettings({ pipeline: { ...settings.pipeline, streamingUpdates: checked }})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Retry Failed Agents</Label>
              <p className="text-xs text-muted-foreground">Automatically retry an agent up to 3 times on Pydantic validation failure.</p>
            </div>
            <Switch 
              checked={settings.pipeline.retryFailedAgents}
              onCheckedChange={(checked) => updateSettings({ pipeline: { ...settings.pipeline, retryFailedAgents: checked }})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
