import { Difficulty } from './notes';

export interface MelodyNote {
  noteIndex: number; // index into ALL_NOTES (0-23)
  duration: number;  // beats (1=quarter, 0.5=eighth, 2=half)
}

export interface Melody {
  id: string;
  title: string;
  composer?: string;
  difficulty: Difficulty;
  tempo: number;
  notes: MelodyNote[];
}

// Note index reference:
// C3=0, C#3=1, D3=2, D#3=3, E3=4, F3=5, F#3=6, G3=7, G#3=8, A3=9, A#3=10, B3=11
// C4=12, C#4=13, D4=14, D#4=15, E4=16, F4=17, F#4=18, G4=19, G#4=20, A4=21, A#4=22, B4=23

export const MELODIES: Melody[] = [
  // --- Beginner (C major, upper octave, simple rhythms) ---
  {
    id: 'twinkle-twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    composer: 'Traditional',
    difficulty: 'beginner',
    tempo: 100,
    notes: [
      // C C G G A A G | F F E E D D C
      { noteIndex: 12, duration: 1 }, { noteIndex: 12, duration: 1 },
      { noteIndex: 19, duration: 1 }, { noteIndex: 19, duration: 1 },
      { noteIndex: 21, duration: 1 }, { noteIndex: 21, duration: 1 },
      { noteIndex: 19, duration: 2 },
      { noteIndex: 17, duration: 1 }, { noteIndex: 17, duration: 1 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 2 },
    ],
  },
  {
    id: 'mary-had-a-little-lamb',
    title: 'Mary Had a Little Lamb',
    composer: 'Traditional',
    difficulty: 'beginner',
    tempo: 110,
    notes: [
      // E D C D E E E | D D D | E G G
      { noteIndex: 16, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 16, duration: 2 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 14, duration: 2 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 19, duration: 1 },
      { noteIndex: 19, duration: 2 },
    ],
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Beethoven',
    difficulty: 'beginner',
    tempo: 108,
    notes: [
      // E E F G | G F E D | C C D E | E. D D
      { noteIndex: 16, duration: 1 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 17, duration: 1 }, { noteIndex: 19, duration: 1 },
      { noteIndex: 19, duration: 1 }, { noteIndex: 17, duration: 1 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 1 }, { noteIndex: 12, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 16, duration: 1.5 }, { noteIndex: 14, duration: 0.5 },
      { noteIndex: 14, duration: 2 },
    ],
  },
  {
    id: 'happy-birthday',
    title: 'Happy Birthday',
    composer: 'Traditional',
    difficulty: 'beginner',
    tempo: 100,
    notes: [
      // G G A G C B | G G A G D C
      { noteIndex: 19, duration: 0.75 }, { noteIndex: 19, duration: 0.25 },
      { noteIndex: 21, duration: 1 }, { noteIndex: 19, duration: 1 },
      { noteIndex: 12, duration: 1 }, { noteIndex: 23, duration: 2 },
      { noteIndex: 19, duration: 0.75 }, { noteIndex: 19, duration: 0.25 },
      { noteIndex: 21, duration: 1 }, { noteIndex: 19, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 12, duration: 2 },
    ],
  },
  {
    id: 'hot-cross-buns',
    title: 'Hot Cross Buns',
    composer: 'Traditional',
    difficulty: 'beginner',
    tempo: 100,
    notes: [
      // E D C - | E D C - | C C D D | E D C -
      { noteIndex: 16, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 2 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 2 },
      { noteIndex: 12, duration: 0.5 }, { noteIndex: 12, duration: 0.5 },
      { noteIndex: 14, duration: 0.5 }, { noteIndex: 14, duration: 0.5 },
      { noteIndex: 16, duration: 1 }, { noteIndex: 14, duration: 1 },
      { noteIndex: 12, duration: 2 },
    ],
  },

  // --- Intermediate (wider range, some accidentals) ---
  {
    id: 'fur-elise-theme',
    title: 'Für Elise (theme)',
    composer: 'Beethoven',
    difficulty: 'intermediate',
    tempo: 130,
    notes: [
      // E D# E D# E B D C A (adapted to C3-B4 range)
      { noteIndex: 16, duration: 0.5 }, { noteIndex: 15, duration: 0.5 },
      { noteIndex: 16, duration: 0.5 }, { noteIndex: 15, duration: 0.5 },
      { noteIndex: 16, duration: 0.5 }, { noteIndex: 11, duration: 0.5 },
      { noteIndex: 14, duration: 0.5 }, { noteIndex: 12, duration: 0.5 },
      { noteIndex: 9, duration: 1 },
    ],
  },
  {
    id: 'canon-in-d',
    title: 'Canon in D (theme)',
    composer: 'Pachelbel',
    difficulty: 'intermediate',
    tempo: 72,
    notes: [
      // Simplified melody in our range
      { noteIndex: 17, duration: 1 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 12, duration: 1 },
      { noteIndex: 11, duration: 1 }, { noteIndex: 9, duration: 1 },
      { noteIndex: 11, duration: 1 }, { noteIndex: 12, duration: 1 },
    ],
  },
  {
    id: 'greensleeves',
    title: 'Greensleeves',
    composer: 'Traditional',
    difficulty: 'intermediate',
    tempo: 90,
    notes: [
      // A C D E F E D B G A B C A A G# A B G E
      { noteIndex: 9, duration: 1 }, { noteIndex: 12, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 16, duration: 1.5 },
      { noteIndex: 17, duration: 0.5 }, { noteIndex: 16, duration: 1 },
      { noteIndex: 14, duration: 1 }, { noteIndex: 11, duration: 1 },
      { noteIndex: 7, duration: 1 }, { noteIndex: 9, duration: 0.5 },
      { noteIndex: 11, duration: 0.5 }, { noteIndex: 12, duration: 1 },
      { noteIndex: 9, duration: 1 }, { noteIndex: 9, duration: 1 },
      { noteIndex: 8, duration: 0.5 }, { noteIndex: 9, duration: 0.5 },
      { noteIndex: 11, duration: 1 }, { noteIndex: 7, duration: 1 },
      { noteIndex: 4, duration: 2 },
    ],
  },

  // --- Advanced (sharps, wider jumps, complex rhythms) ---
  {
    id: 'moonlight-sonata',
    title: 'Moonlight Sonata (opening)',
    composer: 'Beethoven',
    difficulty: 'advanced',
    tempo: 56,
    notes: [
      // C#-E-G# arpeggio pattern
      { noteIndex: 1, duration: 0.33 }, { noteIndex: 4, duration: 0.33 },
      { noteIndex: 8, duration: 0.33 }, { noteIndex: 1, duration: 0.33 },
      { noteIndex: 4, duration: 0.33 }, { noteIndex: 8, duration: 0.33 },
      { noteIndex: 1, duration: 0.33 }, { noteIndex: 4, duration: 0.33 },
      { noteIndex: 8, duration: 0.33 }, { noteIndex: 1, duration: 0.33 },
      { noteIndex: 4, duration: 0.33 }, { noteIndex: 8, duration: 0.33 },
    ],
  },
  {
    id: 'chromatic-exercise',
    title: 'Chromatic Scale Exercise',
    difficulty: 'advanced',
    tempo: 80,
    notes: [
      // C3 through C4 chromatically
      { noteIndex: 0, duration: 0.5 }, { noteIndex: 1, duration: 0.5 },
      { noteIndex: 2, duration: 0.5 }, { noteIndex: 3, duration: 0.5 },
      { noteIndex: 4, duration: 0.5 }, { noteIndex: 5, duration: 0.5 },
      { noteIndex: 6, duration: 0.5 }, { noteIndex: 7, duration: 0.5 },
      { noteIndex: 8, duration: 0.5 }, { noteIndex: 9, duration: 0.5 },
      { noteIndex: 10, duration: 0.5 }, { noteIndex: 11, duration: 0.5 },
      { noteIndex: 12, duration: 2 },
    ],
  },
];

export function getMelodiesByDifficulty(difficulty: Difficulty): Melody[] {
  return MELODIES.filter((m) => m.difficulty === difficulty);
}

export function getMelodyById(id: string): Melody | undefined {
  return MELODIES.find((m) => m.id === id);
}
