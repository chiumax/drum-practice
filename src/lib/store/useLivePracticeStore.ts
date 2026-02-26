import { create } from 'zustand';
import { InstrumentId } from '../patterns/types';
import {
  LiveMode,
  TapEvent,
  TimingGrade,
  SessionStats,
  StepAccuracy,
  BarAccuracy,
  KeyMapping,
  DEFAULT_KEY_MAPPINGS,
} from '../live-practice/types';

function emptyStats(): SessionStats {
  return {
    totalExpected: 0,
    totalHits: 0,
    totalMisses: 0,
    perfectCount: 0,
    greatCount: 0,
    goodCount: 0,
    earlyLateCount: 0,
    averageOffset: 0,
    currentStreak: 0,
    bestStreak: 0,
    barHistory: [],
  };
}

function isHit(grade: TimingGrade): boolean {
  return grade === 'perfect' || grade === 'great' || grade === 'good';
}

interface LivePracticeStore {
  mode: LiveMode;
  focusedTrack: InstrumentId | null;
  isActive: boolean;

  stepAccuracies: Record<string, StepAccuracy>;
  lastTapGrade: TimingGrade | null;
  lastTapInstrument: InstrumentId | null;
  lastTapOffset: number;
  streakBroken: boolean;

  barHistory: BarAccuracy[];
  barHits: number;
  barTotal: number;

  stats: SessionStats;
  keyMappings: KeyMapping[];

  setMode: (mode: LiveMode) => void;
  setFocusedTrack: (instrument: InstrumentId | null) => void;
  startSession: () => void;
  endSession: () => void;
  recordTap: (tap: TapEvent) => void;
  recordMiss: (step: number, instrumentId: InstrumentId) => void;
  setStepAccuracy: (step: number, instrumentId: InstrumentId, grade: TimingGrade, offset: number) => void;
  resetStepAccuracies: () => void;
  recordBarEnd: () => void;
  clearStreakBroken: () => void;
}

export const useLivePracticeStore = create<LivePracticeStore>((set, get) => ({
  mode: 'full-kit',
  focusedTrack: null,
  isActive: false,

  stepAccuracies: {},
  lastTapGrade: null,
  lastTapInstrument: null,
  lastTapOffset: 0,
  streakBroken: false,

  barHistory: [],
  barHits: 0,
  barTotal: 0,

  stats: emptyStats(),
  keyMappings: DEFAULT_KEY_MAPPINGS,

  setMode: (mode: LiveMode) => set({ mode }),

  setFocusedTrack: (instrument: InstrumentId | null) => set({ focusedTrack: instrument }),

  startSession: () =>
    set({
      isActive: true,
      stats: emptyStats(),
      stepAccuracies: {},
      lastTapGrade: null,
      lastTapInstrument: null,
      lastTapOffset: 0,
      streakBroken: false,
      barHistory: [],
      barHits: 0,
      barTotal: 0,
    }),

  endSession: () => set({ isActive: false }),

  recordTap: (tap: TapEvent) => {
    const stats = { ...get().stats };
    const prevStreak = stats.currentStreak;
    let broken = false;
    let barHits = get().barHits;
    let barTotal = get().barTotal;

    if (tap.matchedStep !== null) {
      stats.totalExpected++;
      barTotal++;
      if (isHit(tap.grade)) {
        stats.totalHits++;
        stats.currentStreak++;
        barHits++;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
      } else {
        stats.earlyLateCount++;
        if (prevStreak > 2) broken = true;
        stats.currentStreak = 0;
      }

      switch (tap.grade) {
        case 'perfect': stats.perfectCount++; break;
        case 'great': stats.greatCount++; break;
        case 'good': stats.goodCount++; break;
      }

      // Incremental average offset
      const total = stats.totalHits + stats.earlyLateCount;
      if (total > 0) {
        stats.averageOffset =
          ((stats.averageOffset * (total - 1)) + tap.offset) / total;
      }
    }

    set({
      stats,
      lastTapGrade: tap.grade,
      lastTapInstrument: tap.instrumentId,
      lastTapOffset: tap.offset,
      barHits,
      barTotal,
      ...(broken ? { streakBroken: true } : {}),
    });
  },

  recordMiss: (step: number, instrumentId: InstrumentId) => {
    const stats = { ...get().stats };
    const prevStreak = stats.currentStreak;
    stats.totalExpected++;
    stats.totalMisses++;
    stats.currentStreak = 0;

    const key = `${step}-${instrumentId}`;
    const accuracies = { ...get().stepAccuracies };
    accuracies[key] = { step, instrumentId, grade: 'miss', offset: 0 };

    set({
      stats,
      stepAccuracies: accuracies,
      barTotal: get().barTotal + 1,
      ...(prevStreak > 2 ? { streakBroken: true } : {}),
    });
  },

  setStepAccuracy: (step: number, instrumentId: InstrumentId, grade: TimingGrade, offset: number) => {
    const key = `${step}-${instrumentId}`;
    const accuracies = { ...get().stepAccuracies };
    accuracies[key] = { step, instrumentId, grade, offset };
    set({ stepAccuracies: accuracies });
  },

  resetStepAccuracies: () => set({ stepAccuracies: {} }),

  recordBarEnd: () => {
    const { barHits, barTotal, barHistory, stats } = get();
    if (barTotal === 0) return;
    const accuracy = Math.round((barHits / barTotal) * 100);
    const entry: BarAccuracy = { accuracy, hits: barHits, total: barTotal };
    const newHistory = [...barHistory, entry].slice(-16);
    const newStats = { ...stats, barHistory: [...stats.barHistory, entry] };
    set({ barHistory: newHistory, barHits: 0, barTotal: 0, stats: newStats });
  },

  clearStreakBroken: () => set({ streakBroken: false }),
}));
