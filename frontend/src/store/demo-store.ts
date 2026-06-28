import { create } from 'zustand';

interface DemoState {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoMode: true, // Default to true for the hackathon
  toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
}));
