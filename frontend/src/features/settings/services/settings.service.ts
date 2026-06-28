import { Settings, defaultSettings, settingsSchema } from "../validation/settings-schema";

/**
 * Interface defining the methods for interacting with settings.
 * This abstraction allows swapping LocalStorage with REST APIs later.
 */
export interface ISettingsService {
  getSettings(): Promise<Settings>;
  saveSettings(settings: Partial<Settings>): Promise<Settings>;
  resetSettings(): Promise<Settings>;
  exportSettings(): Promise<string>;
  importSettings(jsonString: string): Promise<Settings>;
}

const STORAGE_KEY = "redmind-settings";

class LocalStorageSettingsService implements ISettingsService {
  async getSettings(): Promise<Settings> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultSettings;
      
      const parsed = JSON.parse(stored);
      // Validate against schema to strip extraneous keys and provide defaults for missing ones
      return settingsSchema.parse(parsed);
    } catch (error) {
      console.warn("Failed to load settings from local storage, returning defaults.", error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<Settings> {
    try {
      const current = await this.getSettings();
      // Deep merge can be tricky, but since our settings schema is just 1 level deep objects, we can spread
      const updated: Settings = {
        general: { ...current.general, ...settings.general },
        appearance: { ...current.appearance, ...settings.appearance },
        notifications: { ...current.notifications, ...settings.notifications },
        pipeline: { ...current.pipeline, ...settings.pipeline },
        aiProvider: { ...current.aiProvider, ...settings.aiProvider },
        export: { ...current.export, ...settings.export },
        accessibility: { ...current.accessibility, ...settings.accessibility },
        developer: { ...current.developer, ...settings.developer },
      };

      const validated = settingsSchema.parse(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      return validated;
    } catch (error) {
      console.error("Failed to save settings to local storage", error);
      throw error;
    }
  }

  async resetSettings(): Promise<Settings> {
    localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  }

  async exportSettings(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettings(jsonString: string): Promise<Settings> {
    try {
      const parsed = JSON.parse(jsonString);
      const validated = settingsSchema.parse(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      return validated;
    } catch (error) {
      console.error("Failed to import settings", error);
      throw new Error("Invalid settings file format or contents.");
    }
  }
}

// Singleton instance to be used across the app
export const settingsService: ISettingsService = new LocalStorageSettingsService();
