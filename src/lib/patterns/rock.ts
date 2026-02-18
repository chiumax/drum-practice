import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const basicRockBeat: DrumPattern = {
  id: 'rock-basic',
  name: 'Basic Rock Beat',
  description: 'The foundation of rock drumming. Kick on 1 & 3, snare on 2 & 4, hi-hat on all 8th notes.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 100,
  totalSteps: 8,
  tags: ['beginner', 'essential'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.7, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,1,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,1,0,0,0]) },
  ],
};

export const rockBeat16th: DrumPattern = {
  id: 'rock-16th',
  name: 'Rock Beat (16ths)',
  description: 'A driving rock beat with 16th note hi-hats for more energy.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 90,
  totalSteps: 16,
  tags: ['intermediate'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]) },
  ],
};

export const fourOnTheFloor: DrumPattern = {
  id: 'rock-four-on-floor',
  name: 'Four on the Floor',
  description: 'Kick on every beat. The backbone of dance and rock music.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 120,
  totalSteps: 8,
  tags: ['beginner', 'dance'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,1,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,1,0,1,0,1,0]) },
  ],
};

export const basicShuffle: DrumPattern = {
  id: 'rock-shuffle',
  name: 'Basic Shuffle',
  description: 'A triplet-based shuffle groove. The "boom-chick-a" feel used in blues and rock.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: 'triplet',
  defaultBpm: 100,
  totalSteps: 12,
  tags: ['intermediate', 'blues', 'shuffle'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,0,1,1,0,1,1,0,1,1,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,1,0,0,0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const rockPatterns = [basicRockBeat, rockBeat16th, fourOnTheFloor, basicShuffle];
