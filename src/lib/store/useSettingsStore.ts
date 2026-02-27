import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MetronomeMode } from '../live-practice/types';

interface SettingsStore {
  masterVolume: number;
  lastPatternId: string | null;
  lastBpm: number;
  metronomeMode: MetronomeMode;
  metronomeVolume: number;
  muteDrumSounds: boolean;
  mutePatternPlayback: boolean;

  setMasterVolume: (vol: number) => void;
  setLastPattern: (id: string, bpm: number) => void;
  setMetronomeMode: (mode: MetronomeMode) => void;
  setMetronomeVolume: (vol: number) => void;
  setMuteDrumSounds: (muted: boolean) => void;
  setMutePatternPlayback: (muted: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      masterVolume: 0.8,
      lastPatternId: null,
      lastBpm: 100,
      metronomeMode: 'every-beat',
      metronomeVolume: 0.7,
      muteDrumSounds: false,
      mutePatternPlayback: false,

      setMasterVolume: (vol: number) => set({ masterVolume: vol }),
      setLastPattern: (id: string, bpm: number) =>
        set({ lastPatternId: id, lastBpm: bpm }),
      setMetronomeMode: (mode: MetronomeMode) => set({ metronomeMode: mode }),
      setMetronomeVolume: (vol: number) => set({ metronomeVolume: vol }),
      setMuteDrumSounds: (muted: boolean) => set({ muteDrumSounds: muted }),
      setMutePatternPlayback: (muted: boolean) => set({ mutePatternPlayback: muted }),
    }),
    { name: 'drum-practice-settings' }
  )
);
