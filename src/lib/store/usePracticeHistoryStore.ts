import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionStats } from '../live-practice/types';
import {
  SpacedRepCard,
  accuracyToQuality,
  computeNextReview,
  isCardDue,
} from '../spaced-repetition/sm2';
import { allPatterns } from '../patterns';

export type PracticeSessionMode = 'loop' | 'tempo-ramp' | 'live';

export interface PracticeSession {
  id: string;
  patternId: string;
  patternName: string;
  mode: PracticeSessionMode;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  bpm: number;
  bpmStart?: number;
  bpmEnd?: number;
  accuracy: number | null;
  stats: SessionStats | null;
}

const MAX_SESSIONS = 2000;

interface PracticeHistoryState {
  sessions: PracticeSession[];
  cards: Record<string, SpacedRepCard>;

  addSession: (session: Omit<PracticeSession, 'id'>) => void;
  updateCard: (patternId: string, accuracy: number) => void;
  clearHistory: () => void;
}

export const usePracticeHistoryStore = create<PracticeHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      cards: {},

      addSession: (sessionData) => {
        const session: PracticeSession = {
          ...sessionData,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, MAX_SESSIONS),
        }));
      },

      updateCard: (patternId, accuracy) => {
        const existing = get().cards[patternId];
        const current = existing ?? {
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
        };
        const quality = accuracyToQuality(accuracy);
        const result = computeNextReview(current, quality);

        set((state) => ({
          cards: {
            ...state.cards,
            [patternId]: {
              patternId,
              easeFactor: result.easeFactor,
              intervalDays: result.intervalDays,
              repetitions: result.repetitions,
              lastReviewedAt: Date.now(),
              nextReviewAt: result.nextReviewAt,
              lastAccuracy: accuracy,
            },
          },
        }));
      },

      clearHistory: () => set({ sessions: [], cards: {} }),
    }),
    {
      name: 'drum-practice-history',
      partialize: (state) => ({
        sessions: state.sessions,
        cards: state.cards,
      }),
    }
  )
);

// Selector helpers (use outside React or in callbacks)

export function getSessionsForPattern(patternId: string): PracticeSession[] {
  return usePracticeHistoryStore
    .getState()
    .sessions.filter((s) => s.patternId === patternId);
}

export function getDuePatterns(): string[] {
  const { cards } = usePracticeHistoryStore.getState();

  // Patterns with cards that are due
  const due = Object.values(cards)
    .filter(isCardDue)
    .sort((a, b) => {
      if (a.nextReviewAt === null) return 1;
      if (b.nextReviewAt === null) return -1;
      return a.nextReviewAt - b.nextReviewAt;
    })
    .map((card) => card.patternId);

  // Patterns never practiced in live mode
  const practiced = new Set(Object.keys(cards));
  const neverPracticed = allPatterns
    .filter((p) => !practiced.has(p.id))
    .map((p) => p.id);

  return [...due, ...neverPracticed];
}

export function getTotalPracticeMs(): number {
  return usePracticeHistoryStore
    .getState()
    .sessions.reduce((sum, s) => sum + s.durationMs, 0);
}

export function getPracticedDays(): Set<string> {
  const days = new Set<string>();
  usePracticeHistoryStore.getState().sessions.forEach((s) => {
    const d = new Date(s.startedAt);
    days.add(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
  });
  return days;
}
