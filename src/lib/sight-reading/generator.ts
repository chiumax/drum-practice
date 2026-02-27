import { Difficulty, getNotesForDifficulty } from './notes';

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a single random note index for Note Drill mode.
 * Avoids repeating the same note twice in a row.
 */
export function generateNoteDrill(
  difficulty: Difficulty,
  previousNote?: number
): number[] {
  const notes = getNotesForDifficulty(difficulty);
  let note = randomFrom(notes);
  // Avoid immediate repeat
  while (notes.length > 1 && note.index === previousNote) {
    note = randomFrom(notes);
  }
  return [note.index];
}

/**
 * Generate a two-note interval challenge.
 * Beginner: intervals up to a perfect 5th (7 semitones)
 * Intermediate: any interval within the range
 * Advanced: any interval within the range
 */
export function generateInterval(difficulty: Difficulty): number[] {
  const notes = getNotesForDifficulty(difficulty);
  const maxInterval = difficulty === 'beginner' ? 7 : 12;

  const first = randomFrom(notes);
  const candidates = notes.filter(
    (n) =>
      n.index !== first.index &&
      Math.abs(n.index - first.index) <= maxInterval
  );

  if (candidates.length === 0) return [first.index, first.index];

  const second = randomFrom(candidates);

  // Always display lower note first
  return first.index < second.index
    ? [first.index, second.index]
    : [second.index, first.index];
}

/**
 * Generate a phrase of multiple notes.
 * Length varies by difficulty: beginner=4, intermediate=4-6, advanced=6-8.
 * Notes are chosen to have reasonable intervals (no huge jumps for beginners).
 */
export function generatePhrase(difficulty: Difficulty): number[] {
  const notes = getNotesForDifficulty(difficulty);
  let length: number;
  let maxStep: number;

  switch (difficulty) {
    case 'beginner':
      length = 4;
      maxStep = 4; // up to major 3rd between consecutive notes
      break;
    case 'intermediate':
      length = 4 + Math.floor(Math.random() * 3); // 4-6
      maxStep = 7;
      break;
    case 'advanced':
      length = 6 + Math.floor(Math.random() * 3); // 6-8
      maxStep = 12;
      break;
  }

  const result: number[] = [];
  let current = randomFrom(notes);
  result.push(current.index);

  for (let i = 1; i < length; i++) {
    const candidates = notes.filter(
      (n) =>
        n.index !== current.index &&
        Math.abs(n.index - current.index) <= maxStep
    );
    if (candidates.length === 0) {
      current = randomFrom(notes);
    } else {
      current = randomFrom(candidates);
    }
    result.push(current.index);
  }

  return result;
}

export type SightReadingMode = 'note-drill' | 'interval' | 'phrase' | 'note-naming' | 'melody';

export function generateChallenge(
  mode: SightReadingMode,
  difficulty: Difficulty,
  previousNote?: number
): number[] {
  switch (mode) {
    case 'note-drill':
    case 'note-naming':
      return generateNoteDrill(difficulty, previousNote);
    case 'interval':
      return generateInterval(difficulty);
    case 'phrase':
      return generatePhrase(difficulty);
    case 'melody':
      return [];
  }
}
