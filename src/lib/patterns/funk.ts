import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const basicFunk: DrumPattern = {
  id: 'funk-basic',
  name: 'Basic Funk',
  description: 'A syncopated funk groove with ghost notes on the snare. The foundation of funk drumming.',
  category: 'funk',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 95,
  totalSteps: 16,
  tags: ['intermediate', 'syncopation'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0]) },
  ],
};

export const syncopatedFunk: DrumPattern = {
  id: 'funk-syncopated',
  name: 'Syncopated Funk',
  description: 'A more complex funk groove with syncopated kick and open hi-hat accents.',
  category: 'funk',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 90,
  totalSteps: 16,
  tags: ['advanced', 'syncopation'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0]) },
    { instrumentId: 'hihat-open', label: 'Open HH', muted: false, volume: 0.5, steps: boolsToSteps([0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0]) },
  ],
};

export const funkPatterns = [basicFunk, syncopatedFunk];
