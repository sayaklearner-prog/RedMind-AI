import { useSettings } from "../hooks/useSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

export function AppearanceTab() {
  const { settings, updateSettings } = useSettings();
  const { setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSettings({ appearance: { ...settings.appearance, theme: newTheme } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how RedMind AI looks on your device.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Select a theme for the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                settings.appearance.theme === "light" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "hover:bg-muted"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <span className="font-medium text-sm">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                settings.appearance.theme === "dark" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "hover:bg-muted"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 border flex items-center justify-center mb-3">
                <Moon className="w-5 h-5 text-slate-400" />
              </div>
              <span className="font-medium text-sm">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                settings.appearance.theme === "system" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "hover:bg-muted"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-900 border shadow-sm flex items-center justify-center mb-3">
                <Monitor className="w-5 h-5 text-slate-500" />
              </div>
              <span className="font-medium text-sm">System</span>
            </button>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing to show more content on screen.
                </p>
              </div>
              <Switch 
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) => 
                  updateSettings({ appearance: { ...settings.appearance, compactMode: checked }})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>UI Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable micro-animations in the interface.
                </p>
              </div>
              <Switch 
                checked={settings.appearance.animations}
                onCheckedChange={(checked) => 
                  updateSettings({ appearance: { ...settings.appearance, animations: checked }})
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
