import { create } from 'zustand';
import { PracticeMode, TempoRampConfig } from '../patterns/types';

interface PracticeStore {
  mode: PracticeMode;
  tempoRampConfig: TempoRampConfig;
  barsPlayed: number;
  currentBpm: number;
  sessionStartTime: number | null;

  setMode: (mode: PracticeMode) => void;
  setTempoRampConfig: (config: Partial<TempoRampConfig>) => void;
  startSession: (bpm: number) => void;
  resetSession: () => void;
}

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  mode: 'loop',
  tempoRampConfig: {
    startBpm: 80,
    endBpm: 140,
    incrementBpm: 5,
    barsPerIncrement: 4,
  },
  barsPlayed: 0,
  currentBpm: 0,
  sessionStartTime: null,

  setMode: (mode: PracticeMode) => set({ mode }),

  setTempoRampConfig: (config: Partial<TempoRampConfig>) =>
    set((state) => ({
      tempoRampConfig: { ...state.tempoRampConfig, ...config },
    })),

  startSession: (bpm: number) =>
    set({ sessionStartTime: Date.now(), barsPlayed: 0, currentBpm: bpm }),

  resetSession: () =>
    set({ sessionStartTime: null, barsPlayed: 0, currentBpm: 0 }),
}));
