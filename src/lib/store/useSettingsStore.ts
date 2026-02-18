import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  masterVolume: number;
  lastPatternId: string | null;
  lastBpm: number;

  setMasterVolume: (vol: number) => void;
  setLastPattern: (id: string, bpm: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      masterVolume: 0.8,
      lastPatternId: null,
      lastBpm: 100,

      setMasterVolume: (vol: number) => set({ masterVolume: vol }),
      setLastPattern: (id: string, bpm: number) =>
        set({ lastPatternId: id, lastBpm: bpm }),
    }),
    { name: 'drum-practice-settings' }
  )
);
