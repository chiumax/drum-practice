import { InstrumentId } from '../patterns/types';

export type PadVoiceVariant =
  | 'kick-deep'
  | 'kick-sub'
  | 'snare-clap'
  | 'snare-rimshot'
  | 'snare-sidestick'
  | 'snare-cross'
  | 'percussion';

export type PadVoiceId = InstrumentId | PadVoiceVariant;

export interface PadConfig {
  id: PadVoiceId;
  label: string;
  keyCode: string;
  keyLabel: string;
  color: string;
  row: number;
  col: number;
}

export interface RecordedHit {
  padId: PadVoiceId;
  timestamp: number; // seconds relative to recording start
  velocity: number;
}

// Hi-hat closed chokes open
export const CHOKE_GROUPS: PadVoiceId[][] = [
  ['hihat-closed', 'hihat-open'],
];

const STANDARD_PADS: PadConfig[] = [
  // Row 0 - Cymbals (1-4)
  { id: 'crash', label: 'Crash', keyCode: 'Digit1', keyLabel: '1', color: 'orange', row: 0, col: 0 },
  { id: 'ride', label: 'Ride', keyCode: 'Digit2', keyLabel: '2', color: 'green', row: 0, col: 1 },
  { id: 'hihat-open', label: 'HH Open', keyCode: 'Digit3', keyLabel: '3', color: 'cyan', row: 0, col: 2 },
  { id: 'hihat-closed', label: 'HH Closed', keyCode: 'Digit4', keyLabel: '4', color: 'cyan', row: 0, col: 3 },
  // Row 1 - Toms (QWER)
  { id: 'tom-high', label: 'Tom Hi', keyCode: 'KeyQ', keyLabel: 'Q', color: 'purple', row: 1, col: 0 },
  { id: 'tom-mid', label: 'Tom Mid', keyCode: 'KeyW', keyLabel: 'W', color: 'purple', row: 1, col: 1 },
  { id: 'tom-low', label: 'Tom Lo', keyCode: 'KeyE', keyLabel: 'E', color: 'purple', row: 1, col: 2 },
  { id: 'snare-rimshot', label: 'Rimshot', keyCode: 'KeyR', keyLabel: 'R', color: 'yellow', row: 1, col: 3 },
  // Row 2 - Snares (ASDF)
  { id: 'snare', label: 'Snare', keyCode: 'KeyA', keyLabel: 'A', color: 'yellow', row: 2, col: 0 },
  { id: 'snare-clap', label: 'Clap', keyCode: 'KeyS', keyLabel: 'S', color: 'yellow', row: 2, col: 1 },
  { id: 'snare-sidestick', label: 'Sidestick', keyCode: 'KeyD', keyLabel: 'D', color: 'yellow', row: 2, col: 2 },
  { id: 'snare-cross', label: 'Cross', keyCode: 'KeyF', keyLabel: 'F', color: 'yellow', row: 2, col: 3 },
  // Row 3 - Kicks (ZXCV)
  { id: 'kick', label: 'Kick', keyCode: 'KeyZ', keyLabel: 'Z', color: 'red', row: 3, col: 0 },
  { id: 'kick-deep', label: 'Deep Kick', keyCode: 'KeyX', keyLabel: 'X', color: 'red', row: 3, col: 1 },
  { id: 'kick-sub', label: 'Sub', keyCode: 'KeyC', keyLabel: 'C', color: 'red', row: 3, col: 2 },
  { id: 'percussion', label: 'Perc', keyCode: 'KeyV', keyLabel: 'V', color: 'purple', row: 3, col: 3 },
];

const ELECTRONIC_PADS: PadConfig[] = [
  // Row 0 - Hats & Cymbals
  { id: 'hihat-closed', label: 'HH Closed', keyCode: 'Digit1', keyLabel: '1', color: 'cyan', row: 0, col: 0 },
  { id: 'hihat-open', label: 'HH Open', keyCode: 'Digit2', keyLabel: '2', color: 'cyan', row: 0, col: 1 },
  { id: 'ride', label: 'Ride', keyCode: 'Digit3', keyLabel: '3', color: 'green', row: 0, col: 2 },
  { id: 'crash', label: 'Crash', keyCode: 'Digit4', keyLabel: '4', color: 'orange', row: 0, col: 3 },
  // Row 1 - Claps & Snares
  { id: 'snare-clap', label: 'Clap', keyCode: 'KeyQ', keyLabel: 'Q', color: 'yellow', row: 1, col: 0 },
  { id: 'snare', label: 'Snare', keyCode: 'KeyW', keyLabel: 'W', color: 'yellow', row: 1, col: 1 },
  { id: 'snare-rimshot', label: 'Rimshot', keyCode: 'KeyE', keyLabel: 'E', color: 'yellow', row: 1, col: 2 },
  { id: 'snare-sidestick', label: 'Sidestick', keyCode: 'KeyR', keyLabel: 'R', color: 'yellow', row: 1, col: 3 },
  // Row 2 - Kicks
  { id: 'kick', label: 'Kick', keyCode: 'KeyA', keyLabel: 'A', color: 'red', row: 2, col: 0 },
  { id: 'kick-deep', label: 'Deep', keyCode: 'KeyS', keyLabel: 'S', color: 'red', row: 2, col: 1 },
  { id: 'kick-sub', label: 'Sub', keyCode: 'KeyD', keyLabel: 'D', color: 'red', row: 2, col: 2 },
  { id: 'percussion', label: 'Perc', keyCode: 'KeyF', keyLabel: 'F', color: 'purple', row: 2, col: 3 },
  // Row 3 - Toms
  { id: 'tom-high', label: 'Tom Hi', keyCode: 'KeyZ', keyLabel: 'Z', color: 'purple', row: 3, col: 0 },
  { id: 'tom-mid', label: 'Tom Mid', keyCode: 'KeyX', keyLabel: 'X', color: 'purple', row: 3, col: 1 },
  { id: 'tom-low', label: 'Tom Lo', keyCode: 'KeyC', keyLabel: 'C', color: 'purple', row: 3, col: 2 },
  { id: 'snare-cross', label: 'Cross', keyCode: 'KeyV', keyLabel: 'V', color: 'yellow', row: 3, col: 3 },
];

const PERCUSSION_PADS: PadConfig[] = [
  // Row 0 - Cymbals
  { id: 'crash', label: 'Crash', keyCode: 'Digit1', keyLabel: '1', color: 'orange', row: 0, col: 0 },
  { id: 'ride', label: 'Ride', keyCode: 'Digit2', keyLabel: '2', color: 'green', row: 0, col: 1 },
  { id: 'hihat-closed', label: 'HH Closed', keyCode: 'Digit3', keyLabel: '3', color: 'cyan', row: 0, col: 2 },
  { id: 'hihat-open', label: 'HH Open', keyCode: 'Digit4', keyLabel: '4', color: 'cyan', row: 0, col: 3 },
  // Row 1 - Toms
  { id: 'tom-high', label: 'Tom Hi', keyCode: 'KeyQ', keyLabel: 'Q', color: 'purple', row: 1, col: 0 },
  { id: 'tom-mid', label: 'Tom Mid', keyCode: 'KeyW', keyLabel: 'W', color: 'purple', row: 1, col: 1 },
  { id: 'tom-low', label: 'Tom Lo', keyCode: 'KeyE', keyLabel: 'E', color: 'purple', row: 1, col: 2 },
  { id: 'percussion', label: 'Perc', keyCode: 'KeyR', keyLabel: 'R', color: 'purple', row: 1, col: 3 },
  // Row 2 - Snare variants
  { id: 'snare', label: 'Snare', keyCode: 'KeyA', keyLabel: 'A', color: 'yellow', row: 2, col: 0 },
  { id: 'snare-rimshot', label: 'Rimshot', keyCode: 'KeyS', keyLabel: 'S', color: 'yellow', row: 2, col: 1 },
  { id: 'snare-sidestick', label: 'Sidestick', keyCode: 'KeyD', keyLabel: 'D', color: 'yellow', row: 2, col: 2 },
  { id: 'snare-cross', label: 'Cross', keyCode: 'KeyF', keyLabel: 'F', color: 'yellow', row: 2, col: 3 },
  // Row 3 - Kicks & Clap
  { id: 'kick', label: 'Kick', keyCode: 'KeyZ', keyLabel: 'Z', color: 'red', row: 3, col: 0 },
  { id: 'kick-deep', label: 'Deep', keyCode: 'KeyX', keyLabel: 'X', color: 'red', row: 3, col: 1 },
  { id: 'kick-sub', label: 'Sub', keyCode: 'KeyC', keyLabel: 'C', color: 'red', row: 3, col: 2 },
  { id: 'snare-clap', label: 'Clap', keyCode: 'KeyV', keyLabel: 'V', color: 'yellow', row: 3, col: 3 },
];

const MINIMAL_PADS: PadConfig[] = [
  // Row 0 - Hi-hats
  { id: 'hihat-closed', label: 'HH Closed', keyCode: 'Digit1', keyLabel: '1', color: 'cyan', row: 0, col: 0 },
  { id: 'hihat-open', label: 'HH Open', keyCode: 'Digit2', keyLabel: '2', color: 'cyan', row: 0, col: 1 },
  { id: 'ride', label: 'Ride', keyCode: 'Digit3', keyLabel: '3', color: 'green', row: 0, col: 2 },
  { id: 'crash', label: 'Crash', keyCode: 'Digit4', keyLabel: '4', color: 'orange', row: 0, col: 3 },
  // Row 1 - Snare & Clap
  { id: 'snare', label: 'Snare', keyCode: 'KeyQ', keyLabel: 'Q', color: 'yellow', row: 1, col: 0 },
  { id: 'snare-clap', label: 'Clap', keyCode: 'KeyW', keyLabel: 'W', color: 'yellow', row: 1, col: 1 },
  { id: 'snare-rimshot', label: 'Rimshot', keyCode: 'KeyE', keyLabel: 'E', color: 'yellow', row: 1, col: 2 },
  { id: 'snare-cross', label: 'Cross', keyCode: 'KeyR', keyLabel: 'R', color: 'yellow', row: 1, col: 3 },
  // Row 2 - Kick
  { id: 'kick', label: 'Kick', keyCode: 'KeyA', keyLabel: 'A', color: 'red', row: 2, col: 0 },
  { id: 'kick-deep', label: 'Deep', keyCode: 'KeyS', keyLabel: 'S', color: 'red', row: 2, col: 1 },
  { id: 'kick-sub', label: 'Sub', keyCode: 'KeyD', keyLabel: 'D', color: 'red', row: 2, col: 2 },
  { id: 'percussion', label: 'Perc', keyCode: 'KeyF', keyLabel: 'F', color: 'purple', row: 2, col: 3 },
  // Row 3 - Toms
  { id: 'tom-high', label: 'Tom Hi', keyCode: 'KeyZ', keyLabel: 'Z', color: 'purple', row: 3, col: 0 },
  { id: 'tom-mid', label: 'Tom Mid', keyCode: 'KeyX', keyLabel: 'X', color: 'purple', row: 3, col: 1 },
  { id: 'tom-low', label: 'Tom Lo', keyCode: 'KeyC', keyLabel: 'C', color: 'purple', row: 3, col: 2 },
  { id: 'snare-sidestick', label: 'Sidestick', keyCode: 'KeyV', keyLabel: 'V', color: 'yellow', row: 3, col: 3 },
];

export const KITS: { name: string; pads: PadConfig[] }[] = [
  { name: 'Standard', pads: STANDARD_PADS },
  { name: 'Electronic', pads: ELECTRONIC_PADS },
  { name: 'Percussion', pads: PERCUSSION_PADS },
  { name: 'Minimal', pads: MINIMAL_PADS },
];

export const ORIGINAL_INSTRUMENTS: Set<string> = new Set([
  'kick', 'snare', 'hihat-closed', 'hihat-open',
  'tom-high', 'tom-mid', 'tom-low', 'crash', 'ride',
]);

export const PAD_COLORS: Record<string, { border: string; glow: string; activeBg: string }> = {
  red: { border: 'border-red-500/50', glow: 'shadow-red-500/40', activeBg: 'bg-red-500/20' },
  yellow: { border: 'border-yellow-400/50', glow: 'shadow-yellow-400/40', activeBg: 'bg-yellow-400/20' },
  cyan: { border: 'border-cyan-400/50', glow: 'shadow-cyan-400/40', activeBg: 'bg-cyan-400/20' },
  purple: { border: 'border-purple-400/50', glow: 'shadow-purple-400/40', activeBg: 'bg-purple-400/20' },
  orange: { border: 'border-orange-400/50', glow: 'shadow-orange-400/40', activeBg: 'bg-orange-400/20' },
  green: { border: 'border-green-400/50', glow: 'shadow-green-400/40', activeBg: 'bg-green-400/20' },
};
