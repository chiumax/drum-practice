/**
 * SM-2 Spaced Repetition Algorithm adapted for drum practice.
 *
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak.
 * Adapted: accuracy % maps to quality 0-5, interval capped at 365 days.
 */

export interface SM2Input {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface SM2Result {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: number; // ms timestamp
}

/**
 * Map accuracy percentage (0-100) to SM-2 quality rating (0-5).
 */
export function accuracyToQuality(accuracy: number): number {
  if (accuracy >= 95) return 5;
  if (accuracy >= 85) return 4;
  if (accuracy >= 70) return 3;
  if (accuracy >= 50) return 2;
  if (accuracy >= 30) return 1;
  return 0;
}

const MIN_EASE = 1.3;
const MAX_INTERVAL_DAYS = 365;

/**
 * Compute the next review schedule using SM-2.
 *
 * quality >= 3: success — advance interval
 * quality < 3: failure — reset to 1 day
 */
export function computeNextReview(
  current: SM2Input,
  quality: number
): SM2Result {
  let { easeFactor, intervalDays, repetitions } = current;

  if (quality < 3) {
    // Failure: reset
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
  } else {
    // Success
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }

    // SM-2 ease factor adjustment
    easeFactor = Math.max(
      MIN_EASE,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    repetitions += 1;
  }

  intervalDays = Math.min(intervalDays, MAX_INTERVAL_DAYS);

  const nextReviewAt = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

  return { easeFactor, intervalDays, repetitions, nextReviewAt };
}

export interface SpacedRepCard {
  patternId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lastReviewedAt: number | null;
  nextReviewAt: number | null;
  lastAccuracy: number | null;
}

/**
 * Check if a card is due for review (or has never been reviewed).
 */
export function isCardDue(card: SpacedRepCard): boolean {
  if (card.nextReviewAt === null) return true;
  return card.nextReviewAt <= Date.now();
}

/**
 * Get a human-readable mastery level from repetition count.
 */
export function getMasteryLevel(repetitions: number): string {
  if (repetitions === 0) return 'New';
  if (repetitions <= 2) return 'Learning';
  if (repetitions <= 5) return 'Familiar';
  return 'Mastered';
}

export function getMasteryColor(repetitions: number): string {
  if (repetitions === 0) return 'bg-gray-700 text-gray-300';
  if (repetitions <= 2) return 'bg-yellow-900 text-yellow-300';
  if (repetitions <= 5) return 'bg-blue-900 text-blue-300';
  return 'bg-green-900 text-green-300';
}
