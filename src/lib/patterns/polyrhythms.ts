import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const threeOverTwo: DrumPattern = {
  id: 'poly-3-over-2',
  name: '3 over 2',
  description: 'Three evenly spaced hits against two. The most fundamental polyrhythm — "pass the but-ter".',
  category: 'polyrhythm',
  timeSignature: { beats: 6, noteValue: 8 },
  subdivision: '8th',
  defaultBpm: 80,
  totalSteps: 6,
  tags: ['beginner', 'polyrhythm'],
  tracks: [
    { instrumentId: 'ride', label: '3s (Ride)', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,0,1,0]) },
    { instrumentId: 'kick', label: '2s (Kick)', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,1,0,0]) },
  ],
};

export const fourOverThree: DrumPattern = {
  id: 'poly-4-over-3',
  name: '4 over 3',
  description: 'Four against three. The hi-hat plays 4 evenly spaced hits while the kick plays 3.',
  category: 'polyrhythm',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 80,
  totalSteps: 12,
  tags: ['intermediate', 'polyrhythm'],
  tracks: [
    { instrumentId: 'hihat-closed', label: '4s (HH)', muted: false, volume: 0.7, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
    { instrumentId: 'kick', label: '3s (Kick)', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0]) },
  ],
};

export const threeOverFour: DrumPattern = {
  id: 'poly-3-over-4',
  name: '3 over 4',
  description: 'Three against four. Ride plays 3 evenly spaced hits over 4 beats. Inversion of 4 over 3.',
  category: 'polyrhythm',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 80,
  totalSteps: 12,
  tags: ['intermediate', 'polyrhythm'],
  tracks: [
    { instrumentId: 'ride', label: '3s (Ride)', muted: false, volume: 0.7, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: '4s (Kick)', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
  ],
};

export const fiveOverFour: DrumPattern = {
  id: 'poly-5-over-4',
  name: '5 over 4',
  description: 'Five against four. A challenging polyrhythm used in West African drumming and progressive music.',
  category: 'polyrhythm',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 70,
  totalSteps: 16,
  tags: ['advanced', 'polyrhythm'],
  tracks: [
    // 5 evenly spaced across 16 steps: approximate at 0, 3.2, 6.4, 9.6, 12.8 → 0, 3, 6, 10, 13
    { instrumentId: 'ride', label: '5s (Ride)', muted: false, volume: 0.7, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0]) },
    { instrumentId: 'kick', label: '4s (Kick)', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]) },
  ],
};

export const sixOverFour: DrumPattern = {
  id: 'poly-6-over-4',
  name: '6 over 4 (Hemiola)',
  description: 'Six against four — the hemiola. Groups of 3 against groups of 2, creating a natural tension.',
  category: 'polyrhythm',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 90,
  totalSteps: 12,
  tags: ['intermediate', 'polyrhythm', 'hemiola'],
  tracks: [
    { instrumentId: 'hihat-closed', label: '6s (HH)', muted: false, volume: 0.6, steps: boolsToSteps([1,0,1,0,1,0,1,0,1,0,1,0]) },
    { instrumentId: 'snare', label: '4s (Snare)', muted: false, volume: 0.8, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Pulse', muted: false, volume: 0.5, steps: boolsToSteps([1,0,0,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const polyAppliedRock: DrumPattern = {
  id: 'poly-applied-rock',
  name: 'Polyrhythmic Rock',
  description: 'A 3-over-4 polyrhythm applied to a rock context. Ride plays in 3 while kick/snare hold 4/4.',
  category: 'polyrhythm',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 100,
  totalSteps: 12,
  tags: ['advanced', 'polyrhythm', 'rock'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride (3s)', muted: false, volume: 0.7, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0]) },
    { instrumentId: 'hihat-closed', label: 'HH', muted: false, volume: 0.5, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,1,0,0,0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const polyrhythmPatterns = [threeOverTwo, fourOverThree, threeOverFour, fiveOverFour, sixOverFour, polyAppliedRock];
