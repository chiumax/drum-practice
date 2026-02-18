import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const bossaNova: DrumPattern = {
  id: 'latin-bossa',
  name: 'Bossa Nova',
  description: 'The classic Brazilian bossa nova pattern. Cross-stick on snare, syncopated bass drum.',
  category: 'latin',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 130,
  totalSteps: 16,
  tags: ['intermediate', 'brazilian'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.5, steps: boolsToSteps([1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]) },
    { instrumentId: 'snare', label: 'Cross Stick', muted: false, volume: 0.7, steps: boolsToSteps([0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const sixEightFeel: DrumPattern = {
  id: 'world-six-eight',
  name: '6/8 Feel',
  description: 'A simple 6/8 time pattern. Common in ballads and world music.',
  category: 'world',
  timeSignature: { beats: 6, noteValue: 8 },
  subdivision: '8th',
  defaultBpm: 80,
  totalSteps: 6,
  tags: ['beginner', '6/8'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0]) },
  ],
};

export const afroSixEight: DrumPattern = {
  id: 'world-afro-six-eight',
  name: 'Afro 6/8',
  description: 'An Afro-Cuban 6/8 bell pattern with supporting kick and snare. Two measures of 6/8.',
  category: 'world',
  timeSignature: { beats: 6, noteValue: 8 },
  subdivision: '8th',
  defaultBpm: 90,
  totalSteps: 12,
  tags: ['intermediate', 'african', '6/8'],
  tracks: [
    { instrumentId: 'ride', label: 'Bell', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,0,1,1,0,1,0,1,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8, steps: boolsToSteps([0,0,0,1,0,0,0,0,0,1,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,1,1,0,0,0,0,0]) },
  ],
};

export const samba: DrumPattern = {
  id: 'latin-samba',
  name: 'Samba',
  description: 'A Brazilian samba pattern with the signature surdo bass and agogô bell accents.',
  category: 'latin',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 100,
  totalSteps: 16,
  tags: ['intermediate', 'brazilian', 'samba'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.5, steps: boolsToSteps([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.7, steps: boolsToSteps([0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Surdo', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0]) },
  ],
};

export const cascara: DrumPattern = {
  id: 'latin-cascara',
  name: 'Cascara',
  description: 'The cascara shell pattern from Afro-Cuban music, played on the side of a timbale or ride bell.',
  category: 'latin',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 100,
  totalSteps: 16,
  tags: ['intermediate', 'cuban'],
  tracks: [
    { instrumentId: 'ride', label: 'Shell', muted: false, volume: 0.7, steps: boolsToSteps([1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0]) },
  ],
};

export const chacha: DrumPattern = {
  id: 'latin-chacha',
  name: 'Cha-Cha',
  description: 'The cha-cha-chá pattern. A Cuban dance rhythm with a distinctive triplet feel on beats 4-and.',
  category: 'latin',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '8th',
  defaultBpm: 120,
  totalSteps: 8,
  tags: ['beginner', 'cuban', 'dance'],
  tracks: [
    { instrumentId: 'ride', label: 'Cowbell', muted: false, volume: 0.7, steps: boolsToSteps([1,0,1,0,1,0,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.7, steps: boolsToSteps([0,0,1,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,1,0,0,0]) },
  ],
};

export const latinPatterns = [bossaNova, sixEightFeel, afroSixEight, samba, cascara, chacha];
