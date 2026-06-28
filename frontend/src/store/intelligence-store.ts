import { create } from 'zustand';

interface AgentStatus {
  agent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  records: number;
  time: string;
}

interface IntelligenceState {
  activeScanId: string | null;
  scanMode: 'live' | 'simulation';
  scanStatus: 'idle' | 'running' | 'completed' | 'failed';
  agentStatuses: AgentStatus[];
  graphNodes: any[];
  graphEdges: any[];
  kpis: {
    totalAssets: number;
    exposedAssets: number;
    activeAttackPaths: number;
    criticalRisks: number;
    openRemediations: number;
    securityPosture: number;
  };
  
  // Actions
  connectWebSocket: () => void;
  launchScan: (target: string, mode: string) => Promise<void>;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  activeScanId: null,
  scanMode: 'simulation',
  scanStatus: 'idle',
  agentStatuses: [
    { agent: "Agent 1: Recon", status: "pending", time: "-", records: 0 },
    { agent: "Agent 2: Exposure", status: "pending", time: "-", records: 0 },
    { agent: "Agent 3: Attack Path", status: "pending", time: "-", records: 0 },
    { agent: "Agent 4: Risk", status: "pending", time: "-", records: 0 },
    { agent: "Agent 5: Remediation", status: "pending", time: "-", records: 0 },
    { agent: "Agent 6: Executive", status: "pending", time: "-", records: 0 },
  ],
  graphNodes: [],
  graphEdges: [],
  kpis: {
    totalAssets: 0,
    exposedAssets: 0,
    activeAttackPaths: 0,
    criticalRisks: 0,
    openRemediations: 0,
    securityPosture: 100,
  },

  connectWebSocket: () => {
    const ws = new WebSocket('ws://localhost:8000/api/ws/events');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;
      
      set((state) => {
        if (msg.type === 'SCAN_STARTED') {
          return { scanStatus: 'running', activeScanId: data.scan_id, scanMode: data.mode };
        }
        
        if (msg.type === 'AGENT_STARTED') {
          const statuses = [...state.agentStatuses];
          const idx = statuses.findIndex(a => a.agent === data.agent);
          if (idx !== -1) {
            statuses[idx].status = 'processing';
          }
          return { agentStatuses: statuses };
        }
        
        if (msg.type === 'AGENT_COMPLETED') {
          const statuses = [...state.agentStatuses];
          const idx = statuses.findIndex(a => a.agent === data.agent);
          if (idx !== -1) {
            statuses[idx].status = 'completed';
            statuses[idx].records = data.records || 0;
            statuses[idx].time = "Done"; // Normally parsed from actual time
          }
          
          // Increment KPIs based on agent
          let kpis = { ...state.kpis };
          if (data.agent.includes("Recon")) kpis.totalAssets += data.records;
          if (data.agent.includes("Exposure")) kpis.exposedAssets += data.records;
          if (data.agent.includes("Attack Path")) kpis.activeAttackPaths += data.records;
          if (data.agent.includes("Risk")) {
              kpis.criticalRisks += Math.floor(data.records * 0.1);
              kpis.securityPosture = Math.max(0, kpis.securityPosture - kpis.criticalRisks * 2);
          }
          if (data.agent.includes("Remediation")) kpis.openRemediations += data.records;
          
          return { agentStatuses: statuses, kpis };
        }

        if (msg.type === 'GRAPH_UPDATED') {
           // We would fetch the graph delta here or apply it. 
           // For simplicity, we just trigger a full fetch from the backend API if needed.
        }
        
        if (msg.type === 'SCAN_COMPLETED') {
          return { scanStatus: 'completed' };
        }
        
        return state;
      });
    };
  },

  launchScan: async (target: string, mode: string) => {
    // Reset state
    set({
      scanStatus: 'idle',
      kpis: { totalAssets: 0, exposedAssets: 0, activeAttackPaths: 0, criticalRisks: 0, openRemediations: 0, securityPosture: 100 },
      agentStatuses: [
        { agent: "Agent 1: Recon", status: "pending", time: "-", records: 0 },
        { agent: "Agent 2: Exposure", status: "pending", time: "-", records: 0 },
        { agent: "Agent 3: Attack Path", status: "pending", time: "-", records: 0 },
        { agent: "Agent 4: Risk", status: "pending", time: "-", records: 0 },
        { agent: "Agent 5: Remediation", status: "pending", time: "-", records: 0 },
        { agent: "Agent 6: Executive", status: "pending", time: "-", records: 0 },
      ]
    });
    
    // Call API
    try {
      const res = await fetch('http://localhost:8000/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, mode })
      });
      const data = await res.json();
      // WebSocket will handle the rest
    } catch (e) {
      console.error(e);
      set({ scanStatus: 'failed' });
    }
  }
}));
