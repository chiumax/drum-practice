import { DrumPattern } from './types';
import { boolsToSteps } from './utils';

export const houseBasic: DrumPattern = {
  id: 'electronic-house',
  name: 'House Beat',
  description: 'Classic four-on-the-floor house beat with offbeat hi-hats and clap on 2 & 4.',
  category: 'electronic',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 124,
  totalSteps: 16,
  tags: ['beginner', 'house', 'dance'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.5, steps: boolsToSteps([0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]) },
    { instrumentId: 'hihat-open', label: 'Open HH', muted: false, volume: 0.4, steps: boolsToSteps([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]) },
    { instrumentId: 'snare', label: 'Clap', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]) },
  ],
};

export const techno: DrumPattern = {
  id: 'electronic-techno',
  name: 'Techno',
  description: 'Driving techno beat with rolling hi-hats and pounding four-on-the-floor kick.',
  category: 'electronic',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 130,
  totalSteps: 16,
  tags: ['intermediate', 'techno'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.5, steps: boolsToSteps([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Clap', muted: false, volume: 0.8, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]) },
  ],
};

export const trapBeat: DrumPattern = {
  id: 'electronic-trap',
  name: 'Trap Beat',
  description: 'Modern trap pattern with rapid hi-hat rolls and heavy 808-style kick placement.',
  category: 'electronic',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 140,
  totalSteps: 16,
  tags: ['intermediate', 'trap', 'hip-hop'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.6, steps: boolsToSteps([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 1.0, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: '808', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0]) },
  ],
};

export const dnb: DrumPattern = {
  id: 'electronic-dnb',
  name: 'Drum & Bass',
  description: 'Fast breakbeat-style pattern. Syncopated kick and snare with rapid hi-hats.',
  category: 'electronic',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 174,
  totalSteps: 16,
  tags: ['advanced', 'breakbeat'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.5, steps: boolsToSteps([1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.9, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 1.0, steps: boolsToSteps([1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0]) },
  ],
};

export const lofi: DrumPattern = {
  id: 'electronic-lofi',
  name: 'Lo-Fi Hip Hop',
  description: 'Laid-back lo-fi hip hop beat with sparse, relaxed placement.',
  category: 'electronic',
  timeSignature: { beats: 4, noteValue: 4 },
  subdivision: '16th',
  defaultBpm: 85,
  totalSteps: 16,
  tags: ['beginner', 'hip-hop', 'chill'],
  tracks: [
    { instrumentId: 'hihat-closed', label: 'Hi-Hat', muted: false, volume: 0.4, steps: boolsToSteps([1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0]) },
    { instrumentId: 'snare', label: 'Snare', muted: false, volume: 0.8, steps: boolsToSteps([0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]) },
    { instrumentId: 'kick', label: 'Kick', muted: false, volume: 0.9, steps: boolsToSteps([1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0]) },
  ],
};

export const electronicPatterns = [houseBasic, techno, trapBeat, dnb, lofi];
