import { InstrumentId } from '../patterns/types';

export type MetronomeMode = 'off' | 'every-beat' | '2-and-4' | 'one-per-bar';

export const TIMING_THRESHOLDS = {
  PERFECT: 0.015,
  GREAT: 0.030,
  GOOD: 0.050,
  MAX_WINDOW: 0.100,
} as const;

export type TimingGrade = 'perfect' | 'great' | 'good' | 'early' | 'late' | 'miss';

export type LiveMode = 'full-kit' | 'single-track';

export interface ExpectedBeat {
  step: number;
  time: number;
  instrumentId: InstrumentId;
  matched: boolean;
}

export interface TapEvent {
  timestamp: number;
  instrumentId: InstrumentId;
  matchedStep: number | null;
  offset: number;
  grade: TimingGrade;
}

export interface StepAccuracy {
  step: number;
  instrumentId: InstrumentId;
  grade: TimingGrade;
  offset: number;
}

export interface BarAccuracy {
  accuracy: number;
  hits: number;
  total: number;
  bpm?: number;
}

export interface DetailedTapRecord {
  step: number;
  instrumentId: InstrumentId;
  offset: number;
  grade: TimingGrade;
  barIndex: number;
}

export interface SessionStats {
  totalExpected: number;
  totalHits: number;
  totalMisses: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  earlyLateCount: number;
  averageOffset: number;
  currentStreak: number;
  bestStreak: number;
  barHistory: BarAccuracy[];
  detailedTaps: DetailedTapRecord[];
}

export interface KeyMapping {
  key: string;
  instrumentId: InstrumentId;
  label: string;
}

export const DEFAULT_KEY_MAPPINGS: KeyMapping[] = [
  { key: 'KeyD', instrumentId: 'kick', label: 'D' },
  { key: 'KeyF', instrumentId: 'snare', label: 'F' },
  { key: 'KeyJ', instrumentId: 'hihat-closed', label: 'J' },
  { key: 'KeyK', instrumentId: 'hihat-open', label: 'K' },
  { key: 'KeyS', instrumentId: 'tom-high', label: 'S' },
  { key: 'KeyA', instrumentId: 'tom-mid', label: 'A' },
  { key: 'KeyL', instrumentId: 'tom-low', label: 'L' },
  { key: 'KeyG', instrumentId: 'crash', label: 'G' },
  { key: 'KeyH', instrumentId: 'ride', label: 'H' },
];

export const GRADE_COLORS: Record<TimingGrade, string> = {
  perfect: 'bg-green-400',
  great: 'bg-lime-400',
  good: 'bg-yellow-400',
  early: 'bg-orange-400',
  late: 'bg-orange-400',
  miss: 'bg-red-500',
};

export const GRADE_TEXT_COLORS: Record<TimingGrade, string> = {
  perfect: 'text-green-400',
  great: 'text-lime-400',
  good: 'text-yellow-400',
  early: 'text-orange-400',
  late: 'text-orange-400',
  miss: 'text-red-500',
};
