export type InstrumentId =
  | 'kick'
  | 'snare'
  | 'hihat-closed'
  | 'hihat-open'
  | 'tom-high'
  | 'tom-mid'
  | 'tom-low'
  | 'crash'
  | 'ride';

export interface Step {
  active: boolean;
  velocity: number; // 0.0 - 1.0
  accent: boolean;
}

export interface Track {
  instrumentId: InstrumentId;
  label: string;
  steps: Step[];
  muted: boolean;
  volume: number; // 0.0 - 1.0
}

export type Subdivision = '8th' | '16th' | 'triplet';

export interface TimeSignature {
  beats: number;
  noteValue: number;
}

export type PatternCategory = 'rock' | 'funk' | 'latin' | 'world' | 'rudiment';

export type Hand = 'R' | 'L';

export interface DrumPattern {
  id: string;
  name: string;
  description: string;
  category: PatternCategory;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  defaultBpm: number;
  totalSteps: number;
  tracks: Track[];
  tags: string[];
  sticking?: Hand[];
}

export type PlayState = 'stopped' | 'playing' | 'paused';

export type PracticeMode = 'loop' | 'tempo-ramp';

export interface TempoRampConfig {
  startBpm: number;
  endBpm: number;
  incrementBpm: number;
  barsPerIncrement: number;
}
