export interface SoundPack {
  id: string;
  songName: string;
  bpm: number;
  filename: string; // directory name under /sounds/
  mappings: [string[], string[], string[], string[]]; // 4 chains, each 48 entries
  holdToPlay: [number[], number[], number[], number[]]; // pad indices per chain
  linkedAreas: [number[][], number[][], number[][], number[][]]; // groups per chain
}

// 4 rows x 12 columns = 48 pads
export const GRID_ROWS = 4;
export const GRID_COLS = 12;
export const TOTAL_PADS = GRID_ROWS * GRID_COLS;

// Keyboard labels for each pad (0-47)
export const PAD_KEY_LABELS: string[] = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Ent',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Sh', '',
];

// KeyboardEvent.code for each pad index (0-47)
export const PAD_KEY_CODES: string[] = [
  'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
  'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal',
  'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY',
  'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight',
  'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH',
  'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
  'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN',
  'KeyM', 'Comma', 'Period', 'Slash', 'ShiftLeft', '',
];
