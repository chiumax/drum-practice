import { create } from 'zustand';
import { DrumPattern } from '../patterns/types';
import { basicRockBeat } from '../patterns/rock';
import { allPatterns } from '../patterns';
import { clonePattern } from '../patterns/utils';

interface PatternStore {
  currentPattern: DrumPattern;
  isModified: boolean;

  loadPattern: (pattern: DrumPattern) => void;
  toggleStep: (trackIndex: number, stepIndex: number) => void;
  setTrackVolume: (trackIndex: number, volume: number) => void;
  toggleTrackMute: (trackIndex: number) => void;
  resetPattern: () => void;
}

export const usePatternStore = create<PatternStore>((set, get) => ({
  currentPattern: clonePattern(basicRockBeat),
  isModified: false,

  loadPattern: (pattern: DrumPattern) => {
    set({ currentPattern: clonePattern(pattern), isModified: false });
  },

  toggleStep: (trackIndex: number, stepIndex: number) => {
    const pattern = clonePattern(get().currentPattern);
    const step = pattern.tracks[trackIndex].steps[stepIndex];
    step.active = !step.active;
    set({ currentPattern: pattern, isModified: true });
  },

  setTrackVolume: (trackIndex: number, volume: number) => {
    const pattern = clonePattern(get().currentPattern);
    pattern.tracks[trackIndex].volume = volume;
    set({ currentPattern: pattern });
  },

  toggleTrackMute: (trackIndex: number) => {
    const pattern = clonePattern(get().currentPattern);
    pattern.tracks[trackIndex].muted = !pattern.tracks[trackIndex].muted;
    set({ currentPattern: pattern });
  },

  resetPattern: () => {
    const original = allPatterns.find(
      (p: DrumPattern) => p.id === get().currentPattern.id
    );
    if (original) {
      set({ currentPattern: clonePattern(original), isModified: false });
    }
  },
}));
