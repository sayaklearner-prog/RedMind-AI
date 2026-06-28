import { create } from "zustand";
import { Settings, defaultSettings } from "../validation/settings-schema";
import { settingsService } from "../services/settings.service";

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  isError: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  importSettings: (jsonString: string) => Promise<void>;
}

export const useSettings = create<SettingsState>((set) => ({
  settings: defaultSettings,
  isLoading: true,
  isError: false,

  loadSettings: async () => {
    set({ isLoading: true, isError: false });
    try {
      const data = await settingsService.getSettings();
      set({ settings: data, isLoading: false });
    } catch (error) {
      console.error("Failed to load settings in store", error);
      set({ isLoading: false, isError: true });
    }
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    try {
      const updated = await settingsService.saveSettings(newSettings);
      set({ settings: updated });
    } catch (error) {
      console.error("Failed to update settings in store", error);
      throw error;
    }
  },

  resetSettings: async () => {
    try {
      const reset = await settingsService.resetSettings();
      set({ settings: reset });
    } catch (error) {
      console.error("Failed to reset settings in store", error);
      throw error;
    }
  },

  importSettings: async (jsonString: string) => {
    try {
      const imported = await settingsService.importSettings(jsonString);
      set({ settings: imported });
    } catch (error) {
      console.error("Failed to import settings in store", error);
      throw error;
    }
  },
}));
