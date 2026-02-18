import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const jazzRideBeat: DrumPattern = {
  id: 'jazz-ride',
  name: 'Jazz Ride Pattern',
  description: 'The classic "spang-a-lang" jazz ride cymbal pattern with feathered bass drum on all four beats.',
  category: 'jazz',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 140,
  totalSteps: 12,
  tags: ['beginner', 'swing'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,1,0,1,1,0,1,1,0,1]) },
    { instrumentId: 'hihat-closed', label: 'HH Foot', muted: false, volume: 0.4, steps: boolsToSteps([0,0,0,0,0,1,0,0,0,0,0,1]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.3, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
  ],
};

export const jazzBrushes: DrumPattern = {
  id: 'jazz-brushes',
  name: 'Jazz Brushes',
  description: 'A brush-style jazz pattern. Snare sweeps with ride accents and hi-hat on 2 and 4.',
  category: 'jazz',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 120,
  totalSteps: 12,
  tags: ['intermediate', 'brushes'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride', muted: false, volume: 0.6, steps: boolsToSteps([1,0,1,1,0,1,1,0,1,1,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.5, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,1,0,0]) },
    { instrumentId: 'hihat-closed', label: 'HH Foot', muted: false, volume: 0.4, steps: boolsToSteps([0,0,0,1,0,0,0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.3, steps: boolsToSteps([1,0,0,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const jazzWaltz: DrumPattern = {
  id: 'jazz-waltz',
  name: 'Jazz Waltz',
  description: 'A 3/4 jazz waltz pattern. Ride cymbal over three beats with hi-hat on beat 2.',
  category: 'jazz',
  timeSignature: { beats: 3, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 150,
  totalSteps: 9,
  tags: ['intermediate', 'waltz', '3/4'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,1,0,1,1,0,1]) },
    { instrumentId: 'hihat-closed', label: 'HH Foot', muted: false, volume: 0.4, steps: boolsToSteps([0,0,0,1,0,0,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.3, steps: boolsToSteps([1,0,0,0,0,0,1,0,0]) },
  ],
};

export const jazzBop: DrumPattern = {
  id: 'jazz-bop',
  name: 'Bebop Comping',
  description: 'An uptempo bebop pattern with syncopated snare "comping" accents against the ride cymbal.',
  category: 'jazz',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 180,
  totalSteps: 12,
  tags: ['advanced', 'bebop'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,1,0,1,1,0,1,1,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.5, steps: boolsToSteps([0,0,0,0,0,1,0,0,0,0,1,0]) },
    { instrumentId: 'hihat-closed', label: 'HH Foot', muted: false, volume: 0.4, steps: boolsToSteps([0,0,0,1,0,0,0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.3, steps: boolsToSteps([1,0,0,0,0,0,0,0,1,0,0,0]) },
  ],
};

export const jazzPatterns = [jazzRideBeat, jazzBrushes, jazzWaltz, jazzBop];
