export interface NoteInfo {
  index: number;       // 0-23, position in our 2-octave range
  name: string;        // e.g. "C3", "C#3"
  letter: string;      // e.g. "C", "D"
  octave: number;      // 3 or 4
  frequency: number;   // Hz (A440 equal temperament)
  isSharp: boolean;    // true for black keys
  midiNumber: number;  // MIDI note number
  // Staff position: number of half-steps above C3.
  // For staff rendering, we map to a "staff slot" (line/space position).
  // staffPosition: semitones from middle C (C4 = 12)
  staffSlot: number;   // diatonic steps from C4 (middle C). C4=0, D4=1, E4=2, etc. C3=-7, D3=-6...
  keyboardKey: string; // computer key mapping
}

// Standard A440 equal temperament frequencies
// f = 440 * 2^((midi - 69) / 12)
function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Map from note letter+accidental to diatonic position relative to C
// C=0, D=1, E=2, F=3, G=4, A=5, B=6
const diatonicMap: Record<string, number> = {
  'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6,
};

function staffSlotFromNote(letter: string, octave: number): number {
  const diatonic = diatonicMap[letter];
  // C4 is our reference (staffSlot = 0)
  return diatonic + (octave - 4) * 7;
}

interface NoteDefinition {
  name: string;
  letter: string;
  octave: number;
  midi: number;
  isSharp: boolean;
  key: string;
}

const noteDefinitions: NoteDefinition[] = [
  // Lower octave (C3-B3) — Z-row for white keys, A-row for black keys
  { name: 'C3',  letter: 'C', octave: 3, midi: 48, isSharp: false, key: 'z' },
  { name: 'C#3', letter: 'C', octave: 3, midi: 49, isSharp: true,  key: 's' },
  { name: 'D3',  letter: 'D', octave: 3, midi: 50, isSharp: false, key: 'x' },
  { name: 'D#3', letter: 'D', octave: 3, midi: 51, isSharp: true,  key: 'd' },
  { name: 'E3',  letter: 'E', octave: 3, midi: 52, isSharp: false, key: 'c' },
  { name: 'F3',  letter: 'F', octave: 3, midi: 53, isSharp: false, key: 'v' },
  { name: 'F#3', letter: 'F', octave: 3, midi: 54, isSharp: true,  key: 'g' },
  { name: 'G3',  letter: 'G', octave: 3, midi: 55, isSharp: false, key: 'b' },
  { name: 'G#3', letter: 'G', octave: 3, midi: 56, isSharp: true,  key: 'h' },
  { name: 'A3',  letter: 'A', octave: 3, midi: 57, isSharp: false, key: 'n' },
  { name: 'A#3', letter: 'A', octave: 3, midi: 58, isSharp: true,  key: 'j' },
  { name: 'B3',  letter: 'B', octave: 3, midi: 59, isSharp: false, key: 'm' },
  // Upper octave (C4-B4) — Q-row for white keys, number row for black keys
  { name: 'C4',  letter: 'C', octave: 4, midi: 60, isSharp: false, key: 'q' },
  { name: 'C#4', letter: 'C', octave: 4, midi: 61, isSharp: true,  key: '2' },
  { name: 'D4',  letter: 'D', octave: 4, midi: 62, isSharp: false, key: 'w' },
  { name: 'D#4', letter: 'D', octave: 4, midi: 63, isSharp: true,  key: '3' },
  { name: 'E4',  letter: 'E', octave: 4, midi: 64, isSharp: false, key: 'e' },
  { name: 'F4',  letter: 'F', octave: 4, midi: 65, isSharp: false, key: 'r' },
  { name: 'F#4', letter: 'F', octave: 4, midi: 66, isSharp: true,  key: '5' },
  { name: 'G4',  letter: 'G', octave: 4, midi: 67, isSharp: false, key: 't' },
  { name: 'G#4', letter: 'G', octave: 4, midi: 68, isSharp: true,  key: '6' },
  { name: 'A4',  letter: 'A', octave: 4, midi: 69, isSharp: false, key: 'y' },
  { name: 'A#4', letter: 'A', octave: 4, midi: 70, isSharp: true,  key: '7' },
  { name: 'B4',  letter: 'B', octave: 4, midi: 71, isSharp: false, key: 'u' },
];

export const ALL_NOTES: NoteInfo[] = noteDefinitions.map((def, index) => ({
  index,
  name: def.name,
  letter: def.letter,
  octave: def.octave,
  frequency: midiToFreq(def.midi),
  isSharp: def.isSharp,
  midiNumber: def.midi,
  staffSlot: staffSlotFromNote(def.letter, def.octave),
  keyboardKey: def.key,
}));

// Lookup: keyboard key → note index
export const KEY_TO_NOTE: Record<string, number> = {};
ALL_NOTES.forEach((note) => {
  KEY_TO_NOTE[note.keyboardKey] = note.index;
});

// Difficulty filters
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export function getNotesForDifficulty(difficulty: Difficulty): NoteInfo[] {
  switch (difficulty) {
    case 'beginner':
      // Natural notes only, C4-B4 (upper octave)
      return ALL_NOTES.filter((n) => !n.isSharp && n.octave === 4);
    case 'intermediate':
      // All notes, full range
      return ALL_NOTES;
    case 'advanced':
      return ALL_NOTES;
  }
}

// Interval names for educational display
const INTERVAL_NAMES: Record<number, string> = {
  0: 'Unison',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone',
  7: 'Perfect 5th',
  8: 'Minor 6th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th',
  12: 'Octave',
};

export function getIntervalName(semitones: number): string {
  const abs = Math.abs(semitones);
  return INTERVAL_NAMES[abs] ?? `${abs} semitones`;
}
