import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";

export function AIProviderTab() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">AI Provider</h3>
        <p className="text-sm text-muted-foreground">
          Configure the language models powering RedMind AI agents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Selection</CardTitle>
          <CardDescription>
            Choose your preferred LLM provider. Keys are managed securely on the backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Provider Engine</Label>
            <Select 
              value={settings.aiProvider.provider}
              onValueChange={(value: any) => updateSettings({ aiProvider: { ...settings.aiProvider, provider: value }})}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featherless">Featherless (Serverless LLM)</SelectItem>
                <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="local">Local (Ollama / vLLM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 pt-2">
            <Label>Model Override</Label>
            <Select 
              value={settings.aiProvider.model}
              onValueChange={(value: any) => updateSettings({ aiProvider: { ...settings.aiProvider, model: value }})}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NousResearch/Hermes-3-Llama-3.1-8B">Hermes-3-Llama-3.1-8B (Default)</SelectItem>
                <SelectItem value="meta-llama/Meta-Llama-3-70B-Instruct">Llama-3-70B-Instruct</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (OpenAI only)</SelectItem>
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic only)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground max-w-md">
              Ensure the selected model is supported by your current provider engine.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex justify-between items-center">
              Connection Status
              {settings.aiProvider.connectionStatus === "connected" ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" /> Disconnected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Last Call
              </span>
              <span className="font-medium">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" /> Latency (avg)
              </span>
              <span className="font-medium">1.2s</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Token Usage (Monthly)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tokens Processed</span>
              <span className="font-medium">1.4M</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-medium">$2.80</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <div className="bg-primary h-2 rounded-full" style={{ width: "28%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
