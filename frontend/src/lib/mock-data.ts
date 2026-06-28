export const kpiData = {
  totalAssets: 14253,
  exposedAssets: 342,
  activeAttackPaths: 18,
  criticalRisks: 5,
  openRemediations: 42,
  securityPosture: 84,
};

export const pipelineStatus = [
  { agent: "Agent 1: Recon", status: "completed", time: "2m 14s", records: 14253 },
  { agent: "Agent 2: Exposure", status: "completed", time: "4m 02s", records: 342 },
  { agent: "Agent 3: Attack Path", status: "completed", time: "1m 45s", records: 18 },
  { agent: "Agent 4: Risk", status: "completed", time: "0m 58s", records: 47 },
  { agent: "Agent 5: Remediation", status: "processing", time: "In Progress", records: 0 },
  { agent: "Agent 6: Executive", status: "pending", time: "-", records: 0 },
];

export const riskDistribution = [
  { name: "Critical", value: 5, color: "var(--destructive)" },
  { name: "High", value: 12, color: "var(--chart-4)" },
  { name: "Medium", value: 45, color: "var(--chart-3)" },
  { name: "Low", value: 180, color: "var(--chart-1)" },
];

export const recentActivity = [
  { id: 1, type: "risk", message: "New Critical Risk identified on payment-gateway-prod", time: "2 mins ago" },
  { id: 2, type: "exposure", message: "AWS Access Key exposed in frontend-repo commit", time: "15 mins ago" },
  { id: 3, type: "path", message: "Attack path from public S3 to internal DB confirmed", time: "1 hour ago" },
  { id: 4, type: "remediation", message: "Patch applied to auth-service container", time: "3 hours ago" },
];

// Graph Data for React Flow
export const graphNodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Public Load Balancer", type: "asset" }, type: "default" },
  { id: "2", position: { x: 100, y: 150 }, data: { label: "Web Server A", type: "asset" }, type: "default" },
  { id: "3", position: { x: 400, y: 150 }, data: { label: "Web Server B", type: "asset" }, type: "default" },
  { id: "4", position: { x: 250, y: 300 }, data: { label: "Customer DB (RDS)", type: "asset", critical: true }, type: "default" },
  { id: "5", position: { x: 50, y: 300 }, data: { label: "Exposed API Key", type: "exposure" }, type: "default" },
];

export const graphEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e5-2", source: "5", target: "2", animated: true, style: { stroke: 'red' } },
];
