import { create } from 'zustand';
import { ALL_NOTES, Difficulty } from '../sight-reading/notes';
import { SightReadingMode, generateChallenge } from '../sight-reading/generator';
import { getMelodyById } from '../sight-reading/melodies';

export type InputMethod = 'piano-keys' | 'keyboard' | 'mic';

export interface NoteResult {
  targetNote: number;
  playedNote: number;
  correct: boolean;
  responseTimeMs: number;
}

interface SessionStats {
  totalAttempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  avgResponseMs: number;
  startTime: number | null;
}

interface SightReadingState {
  mode: SightReadingMode;
  difficulty: Difficulty;
  inputMethod: InputMethod;

  // Current challenge
  targetNotes: number[];
  currentNoteIndex: number;
  challengeActive: boolean;
  challengeStartTime: number | null;

  // Melody mode
  selectedMelodyId: string | null;

  // Results
  results: NoteResult[];
  lastResult: 'correct' | 'wrong' | null;

  // Session stats
  stats: SessionStats;

  // Actions
  setMode: (mode: SightReadingMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setInputMethod: (method: InputMethod) => void;
  setSelectedMelody: (id: string | null) => void;
  startSession: () => void;
  startMelody: () => void;
  nextChallenge: () => void;
  submitNote: (noteIndex: number) => void;
  submitNoteName: (name: string) => void;
  resetSession: () => void;
}

const initialStats: SessionStats = {
  totalAttempts: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  avgResponseMs: 0,
  startTime: null,
};

export const useSightReadingStore = create<SightReadingState>((set, get) => ({
  mode: 'note-drill',
  difficulty: 'beginner',
  inputMethod: 'keyboard',

  targetNotes: [],
  currentNoteIndex: 0,
  challengeActive: false,
  challengeStartTime: null,

  selectedMelodyId: null,

  results: [],
  lastResult: null,

  stats: { ...initialStats },

  setMode: (mode) => {
    set({
      mode,
      targetNotes: [],
      currentNoteIndex: 0,
      challengeActive: false,
      lastResult: null,
      selectedMelodyId: null,
    });
  },

  setDifficulty: (difficulty) => {
    set({
      difficulty,
      targetNotes: [],
      currentNoteIndex: 0,
      challengeActive: false,
      lastResult: null,
      selectedMelodyId: null,
    });
  },

  setInputMethod: (inputMethod) => set({ inputMethod }),

  setSelectedMelody: (id) => set({
    selectedMelodyId: id,
    targetNotes: [],
    currentNoteIndex: 0,
    challengeActive: false,
    lastResult: null,
  }),

  startSession: () => {
    const { mode, difficulty } = get();
    if (mode === 'melody') {
      get().startMelody();
      return;
    }
    const targetNotes = generateChallenge(mode, difficulty);
    set({
      targetNotes,
      currentNoteIndex: 0,
      challengeActive: true,
      challengeStartTime: Date.now(),
      results: [],
      lastResult: null,
      stats: { ...initialStats, startTime: Date.now() },
    });
  },

  startMelody: () => {
    const { selectedMelodyId } = get();
    if (!selectedMelodyId) return;
    const melody = getMelodyById(selectedMelodyId);
    if (!melody) return;
    const noteIndices = melody.notes.map((n) => n.noteIndex);
    set({
      targetNotes: noteIndices,
      currentNoteIndex: 0,
      challengeActive: true,
      challengeStartTime: Date.now(),
      results: [],
      lastResult: null,
      stats: { ...initialStats, startTime: Date.now() },
    });
  },

  nextChallenge: () => {
    const { mode, difficulty, targetNotes, selectedMelodyId } = get();
    if (mode === 'melody' && selectedMelodyId) {
      get().startMelody();
      return;
    }
    const previousNote = targetNotes.length > 0 ? targetNotes[targetNotes.length - 1] : undefined;
    const newTargetNotes = generateChallenge(mode, difficulty, previousNote);
    set({
      targetNotes: newTargetNotes,
      currentNoteIndex: 0,
      challengeActive: true,
      challengeStartTime: Date.now(),
      lastResult: null,
    });
  },

  submitNote: (noteIndex) => {
    const state = get();
    if (!state.challengeActive) return;

    const targetNote = state.targetNotes[state.currentNoteIndex];
    if (targetNote === undefined) return;

    const correct = noteIndex === targetNote;
    const responseTimeMs = state.challengeStartTime
      ? Date.now() - state.challengeStartTime
      : 0;

    const result: NoteResult = {
      targetNote,
      playedNote: noteIndex,
      correct,
      responseTimeMs,
    };

    const newResults = [...state.results, result];
    const newTotal = state.stats.totalAttempts + 1;
    const newCorrect = state.stats.correct + (correct ? 1 : 0);
    const newStreak = correct ? state.stats.streak + 1 : 0;
    const newBestStreak = Math.max(state.stats.bestStreak, newStreak);

    let newAvgMs = state.stats.avgResponseMs;
    if (correct) {
      const prevCorrectCount = state.stats.correct;
      newAvgMs =
        prevCorrectCount === 0
          ? responseTimeMs
          : (state.stats.avgResponseMs * prevCorrectCount + responseTimeMs) /
            (prevCorrectCount + 1);
    }

    const nextIndex = state.currentNoteIndex + 1;
    const challengeComplete = nextIndex >= state.targetNotes.length;

    set({
      results: newResults,
      lastResult: correct ? 'correct' : 'wrong',
      currentNoteIndex: challengeComplete ? state.currentNoteIndex : nextIndex,
      challengeActive: !challengeComplete,
      challengeStartTime: challengeComplete ? null : Date.now(),
      stats: {
        ...state.stats,
        totalAttempts: newTotal,
        correct: newCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        avgResponseMs: newAvgMs,
      },
    });
  },

  submitNoteName: (name: string) => {
    const state = get();
    if (!state.challengeActive) return;

    const targetNote = state.targetNotes[state.currentNoteIndex];
    if (targetNote === undefined) return;

    const noteInfo = ALL_NOTES[targetNote];
    if (!noteInfo) return;

    // Compare name without octave: "C#" matches "C#3" or "C#4"
    const targetName = noteInfo.name.replace(/\d+$/, '');
    const correct = name.toUpperCase() === targetName.toUpperCase();

    // Find the note index for the played name (for result tracking)
    const playedNote = correct ? targetNote : -1;

    const responseTimeMs = state.challengeStartTime
      ? Date.now() - state.challengeStartTime
      : 0;

    const result: NoteResult = {
      targetNote,
      playedNote,
      correct,
      responseTimeMs,
    };

    const newResults = [...state.results, result];
    const newTotal = state.stats.totalAttempts + 1;
    const newCorrect = state.stats.correct + (correct ? 1 : 0);
    const newStreak = correct ? state.stats.streak + 1 : 0;
    const newBestStreak = Math.max(state.stats.bestStreak, newStreak);

    let newAvgMs = state.stats.avgResponseMs;
    if (correct) {
      const prevCorrectCount = state.stats.correct;
      newAvgMs =
        prevCorrectCount === 0
          ? responseTimeMs
          : (state.stats.avgResponseMs * prevCorrectCount + responseTimeMs) /
            (prevCorrectCount + 1);
    }

    const nextIndex = state.currentNoteIndex + 1;
    const challengeComplete = nextIndex >= state.targetNotes.length;

    set({
      results: newResults,
      lastResult: correct ? 'correct' : 'wrong',
      currentNoteIndex: challengeComplete ? state.currentNoteIndex : nextIndex,
      challengeActive: !challengeComplete,
      challengeStartTime: challengeComplete ? null : Date.now(),
      stats: {
        ...state.stats,
        totalAttempts: newTotal,
        correct: newCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        avgResponseMs: newAvgMs,
      },
    });
  },

  resetSession: () => {
    set({
      targetNotes: [],
      currentNoteIndex: 0,
      challengeActive: false,
      challengeStartTime: null,
      results: [],
      lastResult: null,
      stats: { ...initialStats },
    });
  },
}));
