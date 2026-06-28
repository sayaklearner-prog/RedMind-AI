import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";

export function GeneralTab() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings();
  const [appName, setAppName] = useState(settings.general.appName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAppName = async () => {
    try {
      await updateSettings({ general: { ...settings.general, appName } });
      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application's basic configuration.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Update your instance name and local preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="appName">Application Name</Label>
            <div className="flex gap-2">
              <Input 
                id="appName" 
                value={appName} 
                onChange={(e) => setAppName(e.target.value)} 
                className="max-w-md"
              />
              <button 
                onClick={handleSaveAppName}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
          
          <div className="grid gap-2 pt-4">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={settings.general.language} 
              onValueChange={(value: any) => updateSettings({ general: { ...settings.general, language: value }})}
            >
              <SelectTrigger className="max-w-md" id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 pt-4">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={settings.general.timezone} 
              onValueChange={(value: any) => updateSettings({ general: { ...settings.general, timezone: value }})}
            >
              <SelectTrigger className="max-w-md" id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 pt-4">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select 
              value={settings.general.dateFormat} 
              onValueChange={(value: any) => updateSettings({ general: { ...settings.general, dateFormat: value }})}
            >
              <SelectTrigger className="max-w-md" id="dateFormat">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Data Management</CardTitle>
          <CardDescription>
            Import or export your settings. Resetting will restore factory defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={async () => {
                try {
                  const json = await exportSettings();
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "redmind-settings.json";
                  a.click();
                  toast.success("Settings exported successfully");
                } catch (error) {
                  toast.error("Failed to export settings");
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-muted font-medium text-sm transition-colors"
            >
              <Download className="w-4 h-4" /> Export Settings
            </button>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = async (e) => {
                  try {
                    const content = e.target?.result as string;
                    await importSettings(content);
                    toast.success("Settings imported successfully");
                  } catch (error) {
                    toast.error("Invalid settings file");
                  }
                };
                reader.readAsText(file);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-muted font-medium text-sm transition-colors"
            >
              <Upload className="w-4 h-4" /> Import Settings
            </button>
            
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to reset all settings to their defaults?")) {
                  try {
                    await resetSettings();
                    toast.success("Settings reset to defaults");
                    setAppName("RedMind AI"); // Reset local state
                  } catch (error) {
                    toast.error("Failed to reset settings");
                  }
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10 font-medium text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset to Defaults
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
