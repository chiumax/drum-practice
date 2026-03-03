import { create } from 'zustand';
import { SoundPack } from '../launchpad/types';
import { ALL_PACKS } from '../launchpad/packs';
import { audioEngine } from '../audio/AudioEngine';
import { loadPack, playSample, stopPad, isHoldToPlay } from '../launchpad/SampleEngine';

interface LaunchpadState {
  currentPackIndex: number;
  currentChain: number; // 0-3
  activePads: Set<number>; // pad indices with visual feedback
  isLoading: boolean;
  isLoaded: boolean;

  // Actions
  setPack: (index: number) => void;
  setChain: (chain: number) => void;
  triggerPad: (padIndex: number) => void;
  releasePad: (padIndex: number) => void;
  getPack: () => SoundPack;
}

export const useLaunchpadStore = create<LaunchpadState>()((set, get) => ({
  currentPackIndex: 0,
  currentChain: 0,
  activePads: new Set<number>(),
  isLoading: false,
  isLoaded: false,

  setPack: (index: number) => {
    if (index < 0 || index >= ALL_PACKS.length) return;
    set({ currentPackIndex: index, isLoading: true, isLoaded: false, currentChain: 0 });
    audioEngine.init();
    loadPack(ALL_PACKS[index]).then(() => {
      set({ isLoading: false, isLoaded: true });
    });
  },

  setChain: (chain: number) => {
    if (chain < 0 || chain > 3) return;
    // Release all active sounds when switching chains
    const { activePads } = get();
    activePads.forEach((padIndex) => stopPad(padIndex));
    set({ currentChain: chain, activePads: new Set() });
  },

  triggerPad: (padIndex: number) => {
    const { currentPackIndex, currentChain } = get();
    const pack = ALL_PACKS[currentPackIndex];

    // Check if this pad has a sample assigned
    const sampleId = pack.mappings[currentChain][padIndex];
    if (!sampleId) return;

    audioEngine.init();
    playSample(pack, currentChain, padIndex);

    // Visual feedback
    set((s) => ({ activePads: new Set(s.activePads).add(padIndex) }));
  },

  releasePad: (padIndex: number) => {
    const { currentPackIndex, currentChain } = get();
    const pack = ALL_PACKS[currentPackIndex];

    // If hold-to-play, stop the sound on release
    if (isHoldToPlay(pack, currentChain, padIndex)) {
      stopPad(padIndex);
    }

    // Remove visual feedback
    set((s) => {
      const next = new Set(s.activePads);
      next.delete(padIndex);
      return { activePads: next };
    });
  },

  getPack: () => ALL_PACKS[get().currentPackIndex],
}));
