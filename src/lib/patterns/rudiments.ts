import { DrumPattern, Hand } from './types';
import { accentedSteps } from './utils';

export const singleParadiddle: DrumPattern = {
  id: 'rudiment-paradiddle',
  name: 'Single Paradiddle',
  description: 'RLRR LRLL — The essential rudiment combining singles and doubles. Accent on the first note of each group.',
  category: 'rudiment',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 80,
  totalSteps: 16,
  tags: ['rudiment', 'intermediate'],
  sticking: ['R','L','R','R','L','R','L','L','R','L','R','R','L','R','L','L'] as Hand[],
  tracks: [
    {
      instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8,
      steps: accentedSteps(
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
      ),
    },
  ],
};

export const singleStrokeRoll: DrumPattern = {
  id: 'rudiment-single-stroke',
  name: 'Single Stroke Roll',
  description: 'RLRL RLRL — Alternating single strokes. The most fundamental rudiment.',
  category: 'rudiment',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 80,
  totalSteps: 16,
  tags: ['rudiment', 'beginner'],
  sticking: ['R','L','R','L','R','L','R','L','R','L','R','L','R','L','R','L'] as Hand[],
  tracks: [
    {
      instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8,
      steps: accentedSteps(
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
      ),
    },
  ],
};

export const doubleStrokeRoll: DrumPattern = {
  id: 'rudiment-double-stroke',
  name: 'Double Stroke Roll',
  description: 'RRLL RRLL — Two strokes per hand. Essential for speed and control.',
  category: 'rudiment',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 70,
  totalSteps: 16,
  tags: ['rudiment', 'beginner'],
  sticking: ['R','R','L','L','R','R','L','L','R','R','L','L','R','R','L','L'] as Hand[],
  tracks: [
    {
      instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8,
      steps: accentedSteps(
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
      ),
    },
  ],
};

export const rudimentPatterns = [singleParadiddle, singleStrokeRoll, doubleStrokeRoll];
