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

export const halftimeBeat: DrumPattern = {
  id: 'rock-halftime',
  name: 'Half-Time Rock',
  description: 'A half-time feel — snare on beat 3 instead of 2 & 4, creating a heavy, spacious groove.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 130,
  totalSteps: 8,
  tags: ['beginner', 'half-time'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,1,0]) },
  ],
};

export const rockBallad: DrumPattern = {
  id: 'rock-ballad',
  name: 'Rock Ballad',
  description: 'A slow, open rock ballad pattern with crash accents and ride cymbal.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 72,
  totalSteps: 8,
  tags: ['beginner', 'ballad'],
  tracks: [
    { instrumentId: 'ride', label: 'Ride', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'crash', label: 'Crash', muted: false, volume: 0.5, steps: boolsToSteps([1,0,0,0,0,0,0,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,1,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,1,0,0,1]) },
  ],
};

export const punkRock: DrumPattern = {
  id: 'rock-punk',
  name: 'Punk Rock',
  description: 'Fast, driving punk beat. Straight 8ths on the hi-hat with relentless kick and snare.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 180,
  totalSteps: 8,
  tags: ['intermediate', 'punk', 'fast'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.7, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 1.0, steps: boolsToSteps([0,1,0,1,0,1,0,1]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
  ],
};

export const rockFillGroove: DrumPattern = {
  id: 'rock-tom-groove',
  name: 'Tom Groove',
  description: 'A rock groove incorporating toms for a bigger, more tribal feel.',
  category: 'rock',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 100,
  totalSteps: 8,
  tags: ['intermediate', 'toms'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1]) },
    { instrumentId: 'tom-high', label: 'High Tom', muted: false, volume: 0.7, steps: boolsToSteps([0,0,0,0,0,0,1,0]) },
    { instrumentId: 'tom-mid', label: 'Mid Tom', muted: false, volume: 0.7, steps: boolsToSteps([0,0,0,0,0,0,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,1,0,0,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,1,0,0,0]) },
  ],
};

export const rockPatterns = [basicRockBeat, rockBeat16th, fourOnTheFloor, basicShuffle, halftimeBeat, rockBallad, punkRock, rockFillGroove];
