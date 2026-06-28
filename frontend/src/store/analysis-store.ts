import { create } from 'zustand';

export interface AgentProgress {
  agentId: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: string[];
  startTime?: number;
  endTime?: number;
}

export interface AnalysisState {
  id: string;
  url: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  agents: AgentProgress[];
  kpis: {
    securityScore: number;
    totalAssets: number;
    exposedAssets: number;
    criticalRisks: number;
    openRemediations: number;
  };
  intelligence?: any;
  startTime: number;
}

interface AnalysisStore {
  analyses: Record<string, AnalysisState>;
  
  // Actions
  createAnalysis: (id: string, url: string) => void;
  updateAnalysisStatus: (id: string, status: AnalysisState['status']) => void;
  updateAgentStatus: (id: string, agentId: number, status: AgentProgress['status']) => void;
  addAgentLog: (id: string, agentId: number, log: string) => void;
  updateKPIs: (id: string, kpis: Partial<AnalysisState['kpis']>) => void;
  updateIntelligence: (id: string, intelligence: any) => void;
  deleteAnalysis: (id: string) => void;
}

const INITIAL_AGENTS: AgentProgress[] = [
  { agentId: 0, name: "Evidence Collection", status: 'pending', logs: [] },
  { agentId: 1, name: "Recon Intelligence", status: 'pending', logs: [] },
  { agentId: 2, name: "Exposure Analysis", status: 'pending', logs: [] },
  { agentId: 3, name: "Attack Path Analysis", status: 'pending', logs: [] },
  { agentId: 4, name: "Risk Assessment", status: 'pending', logs: [] },
  { agentId: 5, name: "Remediation Planning", status: 'pending', logs: [] },
  { agentId: 6, name: "Report Generation", status: 'pending', logs: [] },
];

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analyses: {},

  createAnalysis: (id, url) => set((state) => ({
    analyses: {
      ...state.analyses,
      [id]: {
        id,
        url,
        status: 'running',
        agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
        kpis: {
          securityScore: 100,
          totalAssets: 0,
          exposedAssets: 0,
          criticalRisks: 0,
          openRemediations: 0,
        },
        startTime: Date.now(),
      }
    }
  })),

  updateAnalysisStatus: (id, status) => set((state) => {
    const analysis = state.analyses[id];
    if (!analysis) return state;
    return {
      analyses: {
        ...state.analyses,
        [id]: { ...analysis, status }
      }
    };
  }),

  updateAgentStatus: (id, agentId, status) => set((state) => {
    const analysis = state.analyses[id];
    if (!analysis) return state;
    
    const updatedAgents = analysis.agents.map((agent) => {
      if (agent.agentId === agentId) {
        return { 
          ...agent, 
          status,
          ...(status === 'running' && !agent.startTime ? { startTime: Date.now() } : {}),
          ...(status === 'completed' || status === 'failed' ? { endTime: Date.now() } : {})
        };
      }
      return agent;
    });

    return {
      analyses: {
        ...state.analyses,
        [id]: { ...analysis, agents: updatedAgents }
      }
    };
  }),

  addAgentLog: (id, agentId, log) => set((state) => {
    const analysis = state.analyses[id];
    if (!analysis) return state;

    const updatedAgents = analysis.agents.map((agent) => {
      if (agent.agentId === agentId) {
        return { ...agent, logs: [...agent.logs, log] };
      }
      return agent;
    });

    return {
      analyses: {
        ...state.analyses,
        [id]: { ...analysis, agents: updatedAgents }
      }
    };
  }),

  updateKPIs: (id, kpis) => set((state) => {
    const analysis = state.analyses[id];
    if (!analysis) return state;
    return {
      analyses: {
        ...state.analyses,
        [id]: { ...analysis, kpis: { ...analysis.kpis, ...kpis } }
      }
    };
  }),

  updateIntelligence: (id, intelligence) => set((state) => {
    const analysis = state.analyses[id];
    if (!analysis) return state;
    return {
      analyses: {
        ...state.analyses,
        [id]: { ...analysis, intelligence }
      }
    };
  }),

  deleteAnalysis: (id) => set((state) => {
    const { [id]: _, ...rest } = state.analyses;
    return { analyses: rest };
  })
}));
