import { PadVoiceId, RecordedHit } from './types';

export interface Routine {
  name: string;
  description: string;
  bpm: number;
  kit: number; // recommended kit index
  hits: RecordedHit[];
}

// Helper: build hits from [sixteenth_position, padId, velocity] tuples
function buildHits(
  bpm: number,
  pattern: [number, PadVoiceId, number][]
): RecordedHit[] {
  const sixteenth = 60 / bpm / 4;
  return pattern.map(([pos, padId, velocity]) => ({
    padId,
    timestamp: pos * sixteenth,
    velocity,
  }));
}

// --- Routines ---

const boomBap: Routine = {
  name: 'Boom Bap',
  description: 'Classic hip-hop groove — lazy kick, snare on 2 & 4, open hat before the bar',
  bpm: 90,
  kit: 0,
  hits: buildHits(90, [
    // Bar 1
    [0, 'kick', 0.9],
    [0, 'hihat-closed', 0.7],
    [2, 'hihat-closed', 0.5],
    [4, 'hihat-closed', 0.7],
    [4, 'snare', 0.85],
    [6, 'hihat-closed', 0.5],
    [7, 'kick', 0.7],
    [8, 'hihat-closed', 0.7],
    [10, 'hihat-closed', 0.5],
    [12, 'hihat-closed', 0.7],
    [12, 'snare', 0.85],
    [14, 'hihat-open', 0.6],
    // Bar 2
    [16, 'kick', 0.9],
    [16, 'hihat-closed', 0.7],
    [18, 'hihat-closed', 0.5],
    [20, 'hihat-closed', 0.7],
    [20, 'snare', 0.85],
    [22, 'hihat-closed', 0.5],
    [23, 'kick', 0.65],
    [24, 'hihat-closed', 0.7],
    [24, 'kick', 0.8],
    [26, 'hihat-closed', 0.5],
    [28, 'hihat-closed', 0.7],
    [28, 'snare', 0.85],
    [30, 'hihat-open', 0.6],
  ]),
};

const fourOnTheFloor: Routine = {
  name: 'House',
  description: 'Four-on-the-floor kick, claps on 2 & 4, open hats on the ands',
  bpm: 124,
  kit: 1, // Electronic
  hits: buildHits(124, [
    // Bar 1
    [0, 'kick', 0.9],
    [2, 'hihat-open', 0.5],
    [4, 'kick', 0.85],
    [4, 'snare-clap', 0.8],
    [6, 'hihat-open', 0.5],
    [8, 'kick', 0.85],
    [10, 'hihat-open', 0.5],
    [12, 'kick', 0.85],
    [12, 'snare-clap', 0.8],
    [14, 'hihat-open', 0.5],
    // Bar 2
    [16, 'kick', 0.9],
    [18, 'hihat-open', 0.5],
    [20, 'kick', 0.85],
    [20, 'snare-clap', 0.8],
    [22, 'hihat-open', 0.5],
    [24, 'kick', 0.85],
    [26, 'hihat-open', 0.5],
    [28, 'kick', 0.85],
    [28, 'snare-clap', 0.8],
    [30, 'hihat-open', 0.6],
  ]),
};

const trap: Routine = {
  name: 'Trap',
  description: 'Heavy 808 kick, snare on 3, rapid hi-hat rolls with open hat accents',
  bpm: 140,
  kit: 1, // Electronic
  hits: buildHits(140, [
    // Bar 1 — hi-hats on every 16th with some 32nd rolls
    [0, 'kick-sub', 0.95],
    [0, 'hihat-closed', 0.7],
    [1, 'hihat-closed', 0.5],
    [2, 'hihat-closed', 0.7],
    [3, 'hihat-closed', 0.5],
    [3.5, 'hihat-closed', 0.4], // 32nd roll
    [4, 'hihat-closed', 0.7],
    [5, 'hihat-closed', 0.5],
    [6, 'hihat-open', 0.6],
    [7, 'hihat-closed', 0.5],
    [8, 'snare', 0.9],
    [8, 'hihat-closed', 0.6],
    [9, 'hihat-closed', 0.5],
    [10, 'hihat-closed', 0.7],
    [11, 'hihat-closed', 0.5],
    [11.5, 'hihat-closed', 0.4], // 32nd roll
    [12, 'hihat-closed', 0.7],
    [13, 'hihat-closed', 0.5],
    [13.5, 'hihat-closed', 0.4], // 32nd roll
    [14, 'hihat-open', 0.65],
    [15, 'kick-sub', 0.8],
    // Bar 2
    [16, 'kick-sub', 0.95],
    [16, 'hihat-closed', 0.7],
    [17, 'hihat-closed', 0.5],
    [18, 'hihat-closed', 0.7],
    [19, 'hihat-closed', 0.5],
    [19.5, 'hihat-closed', 0.4],
    [20, 'hihat-closed', 0.7],
    [21, 'hihat-closed', 0.5],
    [22, 'hihat-open', 0.6],
    [23, 'kick-sub', 0.75],
    [24, 'snare', 0.9],
    [24, 'hihat-closed', 0.6],
    [25, 'hihat-closed', 0.5],
    [26, 'hihat-closed', 0.7],
    [26.5, 'hihat-closed', 0.4], // 32nd triplet roll
    [27, 'hihat-closed', 0.5],
    [27.5, 'hihat-closed', 0.4],
    [28, 'hihat-closed', 0.7],
    [28, 'kick-sub', 0.7],
    [29, 'hihat-closed', 0.5],
    [29.5, 'hihat-closed', 0.4],
    [30, 'hihat-open', 0.7],
    [31, 'hihat-closed', 0.45],
  ]),
};

const funkyBreak: Routine = {
  name: 'Funky Break',
  description: 'Broken beat funk with syncopated kick, ghost snares, and ride bell',
  bpm: 105,
  kit: 0,
  hits: buildHits(105, [
    // Bar 1
    [0, 'kick', 0.9],
    [0, 'ride', 0.6],
    [2, 'ride', 0.5],
    [3, 'snare', 0.4], // ghost note
    [4, 'snare', 0.85],
    [4, 'ride', 0.6],
    [6, 'ride', 0.5],
    [6, 'kick', 0.75],
    [8, 'ride', 0.6],
    [9, 'kick', 0.7],
    [10, 'snare', 0.4], // ghost
    [10, 'ride', 0.5],
    [12, 'snare', 0.85],
    [12, 'ride', 0.6],
    [14, 'ride', 0.5],
    [15, 'snare', 0.35], // ghost
    // Bar 2
    [16, 'kick', 0.9],
    [16, 'ride', 0.6],
    [18, 'ride', 0.5],
    [19, 'snare', 0.4],
    [20, 'snare', 0.85],
    [20, 'ride', 0.6],
    [21, 'kick', 0.6],
    [22, 'ride', 0.5],
    [24, 'ride', 0.6],
    [24, 'kick', 0.8],
    [26, 'ride', 0.5],
    [26, 'snare', 0.4],
    [27, 'kick', 0.65],
    [28, 'snare', 0.85],
    [28, 'ride', 0.6],
    [30, 'ride', 0.5],
    [30, 'snare-rimshot', 0.5],
    [31, 'snare-rimshot', 0.6],
  ]),
};

const latinGroove: Routine = {
  name: 'Latin',
  description: 'Son clave groove with cross-stick, toms, and cascara on ride',
  bpm: 100,
  kit: 2, // Percussion
  hits: buildHits(100, [
    // 3-2 son clave on cross-stick
    // Bar 1 (3 side): beats at 1, 1-and-a-half, 2-and
    [0, 'snare-cross', 0.75],
    [0, 'kick', 0.8],
    [3, 'snare-cross', 0.75],
    [4, 'ride', 0.5],
    [6, 'snare-cross', 0.75],
    [8, 'ride', 0.5],
    [8, 'kick', 0.7],
    [10, 'tom-low', 0.5],
    [12, 'ride', 0.5],
    [14, 'tom-mid', 0.5],
    // Bar 2 (2 side): beats at 2, 3
    [16, 'ride', 0.5],
    [16, 'kick', 0.8],
    [18, 'tom-low', 0.5],
    [20, 'snare-cross', 0.75],
    [20, 'ride', 0.5],
    [22, 'tom-high', 0.5],
    [24, 'snare-cross', 0.75],
    [24, 'ride', 0.5],
    [24, 'kick', 0.7],
    [26, 'tom-mid', 0.5],
    [28, 'ride', 0.5],
    [30, 'tom-low', 0.5],
    [31, 'tom-low', 0.4],
  ]),
};

const bigFill: Routine = {
  name: 'Tom Fill',
  description: 'Descending tom fill — high to low, crash landing',
  bpm: 120,
  kit: 0,
  hits: buildHits(120, [
    // Steady groove first bar
    [0, 'kick', 0.9],
    [0, 'hihat-closed', 0.7],
    [2, 'hihat-closed', 0.5],
    [4, 'snare', 0.85],
    [4, 'hihat-closed', 0.7],
    [6, 'hihat-closed', 0.5],
    [8, 'kick', 0.85],
    [8, 'hihat-closed', 0.7],
    [10, 'hihat-closed', 0.5],
    [12, 'snare', 0.85],
    [12, 'hihat-closed', 0.7],
    [14, 'hihat-closed', 0.5],
    // Fill bar — descending toms
    [16, 'tom-high', 0.8],
    [17, 'tom-high', 0.75],
    [18, 'tom-high', 0.85],
    [19, 'tom-high', 0.7],
    [20, 'tom-mid', 0.8],
    [21, 'tom-mid', 0.75],
    [22, 'tom-mid', 0.85],
    [23, 'tom-mid', 0.7],
    [24, 'tom-low', 0.8],
    [25, 'tom-low', 0.75],
    [26, 'tom-low', 0.85],
    [27, 'tom-low', 0.7],
    [28, 'snare', 0.9],
    [29, 'snare', 0.85],
    [30, 'snare', 0.95],
    [31, 'kick', 0.95],
    [31, 'crash', 0.9],
  ]),
};

const halfTimeShuffle: Routine = {
  name: 'Purdie Shuffle',
  description: 'Triplet-feel shuffle with ghost notes — the legendary Bernard Purdie groove',
  bpm: 96,
  kit: 0,
  // Triplet grid: 12 triplet-eighths per bar, 24 for 2 bars
  // Each triplet-eighth = (60/96) / 3 * 2 = beat/3
  // Using sixteenths won't work perfectly for triplets, so we calculate manually
  hits: (() => {
    const beat = 60 / 96;
    const triplet = beat / 3;
    const h = (pos: number, padId: PadVoiceId, vel: number): RecordedHit => ({
      padId,
      timestamp: pos * triplet,
      velocity: vel,
    });
    return [
      // Bar 1
      h(0, 'hihat-closed', 0.7),
      h(0, 'kick', 0.9),
      h(1, 'hihat-closed', 0.3),    // ghost hat
      h(2, 'hihat-closed', 0.6),
      h(2, 'snare', 0.3),           // ghost snare
      h(3, 'hihat-closed', 0.7),
      h(3, 'snare', 0.85),          // backbeat
      h(4, 'hihat-closed', 0.3),
      h(4, 'snare', 0.25),          // ghost
      h(5, 'hihat-closed', 0.6),
      h(6, 'hihat-closed', 0.7),
      h(6, 'kick', 0.85),
      h(7, 'hihat-closed', 0.3),
      h(8, 'hihat-closed', 0.6),
      h(8, 'snare', 0.3),           // ghost
      h(9, 'hihat-closed', 0.7),
      h(9, 'snare', 0.85),          // backbeat
      h(10, 'hihat-closed', 0.3),
      h(10, 'snare', 0.25),         // ghost
      h(11, 'hihat-closed', 0.6),
      // Bar 2
      h(12, 'hihat-closed', 0.7),
      h(12, 'kick', 0.9),
      h(13, 'hihat-closed', 0.3),
      h(14, 'hihat-closed', 0.6),
      h(14, 'snare', 0.3),
      h(15, 'hihat-closed', 0.7),
      h(15, 'snare', 0.85),
      h(16, 'hihat-closed', 0.3),
      h(16, 'snare', 0.25),
      h(17, 'hihat-closed', 0.6),
      h(17, 'kick', 0.7),
      h(18, 'hihat-closed', 0.7),
      h(18, 'kick', 0.8),
      h(19, 'hihat-closed', 0.3),
      h(20, 'hihat-closed', 0.6),
      h(20, 'snare', 0.3),
      h(21, 'hihat-closed', 0.7),
      h(21, 'snare', 0.85),
      h(22, 'hihat-closed', 0.3),
      h(22, 'snare', 0.25),
      h(23, 'hihat-open', 0.55),
    ];
  })(),
};

const disco: Routine = {
  name: 'Disco',
  description: 'Driving disco beat — open hats on every and, four kicks, snare on 2 & 4',
  bpm: 115,
  kit: 0,
  hits: buildHits(115, [
    // Bar 1
    [0, 'kick', 0.9],
    [0, 'hihat-open', 0.55],
    [2, 'hihat-open', 0.65],
    [4, 'kick', 0.85],
    [4, 'snare', 0.85],
    [4, 'hihat-open', 0.55],
    [6, 'hihat-open', 0.65],
    [8, 'kick', 0.85],
    [8, 'hihat-open', 0.55],
    [10, 'hihat-open', 0.65],
    [12, 'kick', 0.85],
    [12, 'snare', 0.85],
    [12, 'hihat-open', 0.55],
    [14, 'hihat-open', 0.65],
    // Bar 2
    [16, 'kick', 0.9],
    [16, 'hihat-open', 0.55],
    [18, 'hihat-open', 0.65],
    [20, 'kick', 0.85],
    [20, 'snare', 0.85],
    [20, 'hihat-open', 0.55],
    [22, 'hihat-open', 0.65],
    [24, 'kick', 0.85],
    [24, 'hihat-open', 0.55],
    [26, 'hihat-open', 0.65],
    [28, 'kick', 0.85],
    [28, 'snare', 0.85],
    [28, 'hihat-open', 0.55],
    [30, 'hihat-open', 0.65],
  ]),
};

export const ROUTINES: Routine[] = [
  boomBap,
  fourOnTheFloor,
  trap,
  funkyBreak,
  latinGroove,
  halfTimeShuffle,
  disco,
  bigFill,
];
