import { z } from "zod";

// --- General ---
export const generalSettingsSchema = z.object({
  appName: z.string().min(1, "App name is required").default("RedMind AI"),
  language: z.enum(["en", "es", "fr", "de", "zh", "ja"]).default("en"),
  timezone: z.string().default("UTC"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("YYYY-MM-DD"),
});

// --- Appearance ---
export const appearanceSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  accentColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).default("#ff0000"),
  sidebarStyle: z.enum(["default", "compact", "floating"]).default("default"),
  compactMode: z.boolean().default(false),
  animations: z.boolean().default(true),
});

// --- Notifications ---
export const notificationSettingsSchema = z.object({
  enableNotifications: z.boolean().default(true),
  desktopNotifications: z.boolean().default(true),
  pipelineAlerts: z.boolean().default(true),
  analysisCompletion: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  webhookNotifications: z.boolean().default(false),
});

// --- Pipeline/Analysis ---
export const pipelineSettingsSchema = z.object({
  defaultScanMode: z.enum(["fast", "standard", "deep"]).default("standard"),
  maxConcurrentAnalyses: z.number().min(1).max(10).default(3),
  maxCrawlDepth: z.number().min(1).max(5).default(3),
  evidenceCollectionTimeout: z.number().min(10).max(600).default(120),
  defaultRiskThreshold: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  confidenceThreshold: z.number().min(0).max(100).default(70),
  autoSaveReports: z.boolean().default(true),
  autoRefreshDashboard: z.boolean().default(true),
  streamingUpdates: z.boolean().default(true),
  retryFailedAgents: z.boolean().default(true),
});

// --- AI Provider ---
export const aiProviderSettingsSchema = z.object({
  provider: z.enum(["featherless", "openai", "anthropic", "local"]).default("featherless"),
  model: z.string().default("NousResearch/Hermes-3-Llama-3.1-8B"),
  connectionStatus: z.enum(["connected", "disconnected", "error"]).default("connected"),
});

// --- Export ---
export const exportSettingsSchema = z.object({
  defaultFormat: z.enum(["pdf", "html", "json", "docx"]).default("pdf"),
  enableCompression: z.boolean().default(true),
  reportBranding: z.boolean().default(true),
});

// --- Accessibility ---
export const accessibilitySettingsSchema = z.object({
  highContrast: z.boolean().default(false),
  largeText: z.boolean().default(false),
  keyboardNavigation: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  screenReaderLabels: z.boolean().default(true),
  focusIndicators: z.boolean().default(true),
});

// --- Developer ---
export const developerSettingsSchema = z.object({
  debugMode: z.boolean().default(false),
  verboseLogging: z.boolean().default(false),
  // Read-only values in UI, but part of schema for structure
  environment: z.string().default("development"),
  backendUrl: z.string().default("http://127.0.0.1:8000"),
  frontendVersion: z.string().default("0.1.0"),
  backendVersion: z.string().default("1.1.0"),
  pipelineVersion: z.string().default("2.0"),
  currentBranch: z.string().default("main"),
});

// --- Master Schema ---
export const settingsSchema = z.object({
  general: generalSettingsSchema,
  appearance: appearanceSettingsSchema,
  notifications: notificationSettingsSchema,
  pipeline: pipelineSettingsSchema,
  aiProvider: aiProviderSettingsSchema,
  export: exportSettingsSchema,
  accessibility: accessibilitySettingsSchema,
  developer: developerSettingsSchema,
});

export type Settings = z.infer<typeof settingsSchema>;
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type PipelineSettings = z.infer<typeof pipelineSettingsSchema>;
export type AIProviderSettings = z.infer<typeof aiProviderSettingsSchema>;
export type ExportSettings = z.infer<typeof exportSettingsSchema>;
export type AccessibilitySettings = z.infer<typeof accessibilitySettingsSchema>;
export type DeveloperSettings = z.infer<typeof developerSettingsSchema>;

export const defaultSettings: Settings = {
  general: generalSettingsSchema.parse({}),
  appearance: appearanceSettingsSchema.parse({}),
  notifications: notificationSettingsSchema.parse({}),
  pipeline: pipelineSettingsSchema.parse({}),
  aiProvider: aiProviderSettingsSchema.parse({}),
  export: exportSettingsSchema.parse({}),
  accessibility: accessibilitySettingsSchema.parse({}),
  developer: developerSettingsSchema.parse({}),
};
