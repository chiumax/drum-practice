'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Staff } from '@/components/sight-reading/Staff';
import { PianoKeyboard } from '@/components/sight-reading/PianoKeyboard';
import { SightReadingModeSelector } from '@/components/sight-reading/ModeSelector';
import { DifficultySelector } from '@/components/sight-reading/DifficultySelector';
import { StatsPanel } from '@/components/sight-reading/StatsPanel';
import { ResultFeedback } from '@/components/sight-reading/ResultFeedback';
import { NoteNameInput } from '@/components/sight-reading/NoteNameInput';
import { MelodySelector } from '@/components/sight-reading/MelodySelector';
import { InputMethodSelector } from '@/components/sight-reading/InputMethodSelector';
import { MicIndicator } from '@/components/sight-reading/MicIndicator';
import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { usePianoKeyboard } from '@/lib/hooks/usePianoKeyboard';
import { useMicInput } from '@/lib/hooks/useMicInput';
import { playPianoNote, playErrorBuzz } from '@/lib/audio/PianoSynth';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { ALL_NOTES } from '@/lib/sight-reading/notes';
import { getMelodyById } from '@/lib/sight-reading/melodies';

export default function SightReadingPage() {
  const mode = useSightReadingStore((s) => s.mode);
  const inputMethod = useSightReadingStore((s) => s.inputMethod);
  const targetNotes = useSightReadingStore((s) => s.targetNotes);
  const currentNoteIndex = useSightReadingStore((s) => s.currentNoteIndex);
  const challengeActive = useSightReadingStore((s) => s.challengeActive);
  const selectedMelodyId = useSightReadingStore((s) => s.selectedMelodyId);
  const results = useSightReadingStore((s) => s.results);
  const stats = useSightReadingStore((s) => s.stats);
  const startSession = useSightReadingStore((s) => s.startSession);
  const nextChallenge = useSightReadingStore((s) => s.nextChallenge);
  const submitNote = useSightReadingStore((s) => s.submitNote);
  const submitNoteName = useSightReadingStore((s) => s.submitNoteName);
  const resetSession = useSightReadingStore((s) => s.resetSession);
  const setSelectedMelody = useSightReadingStore((s) => s.setSelectedMelody);

  const [activeNote, setActiveNote] = useState<number | null>(null);
  const activeNoteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (activeNoteTimeout.current) clearTimeout(activeNoteTimeout.current);
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    };
  }, []);

  const handleNotePlay = useCallback(
    (noteIndex: number) => {
      audioEngine.init();

      setActiveNote(noteIndex);
      if (activeNoteTimeout.current) clearTimeout(activeNoteTimeout.current);
      activeNoteTimeout.current = setTimeout(() => setActiveNote(null), 200);

      if (!challengeActive) {
        playPianoNote(noteIndex);
        return;
      }

      const state = useSightReadingStore.getState();
      const targetNote = state.targetNotes[state.currentNoteIndex];
      const correct = noteIndex === targetNote;

      if (correct) {
        playPianoNote(noteIndex);
      } else {
        playPianoNote(noteIndex, 0.3);
        playErrorBuzz();
      }

      submitNote(noteIndex);

      const updatedState = useSightReadingStore.getState();
      if (!updatedState.challengeActive) {
        if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = setTimeout(() => {
          nextChallenge();
        }, 1200);
      }
    },
    [challengeActive, submitNote, nextChallenge]
  );

  // Keyboard input — disabled in note-naming mode and piano-keys-only mode
  const keyboardEnabled = mode !== 'note-naming' && inputMethod === 'keyboard';
  usePianoKeyboard(handleNotePlay, keyboardEnabled);

  // Mic input
  const micEnabled = inputMethod === 'mic' && mode !== 'note-naming';
  const micInput = useMicInput(handleNotePlay, micEnabled);

  const handleNoteNameAnswer = useCallback(
    (correct: boolean) => {
      audioEngine.init();
      const state = useSightReadingStore.getState();
      const targetNote = state.targetNotes[state.currentNoteIndex];

      if (correct) {
        playPianoNote(targetNote);
      } else {
        playErrorBuzz();
      }

      const noteInfo = ALL_NOTES[targetNote];
      const name = noteInfo ? noteInfo.name.replace(/\d+$/, '') : '';
      submitNoteName(correct ? name : 'X');

      const updatedState = useSightReadingStore.getState();
      if (!updatedState.challengeActive) {
        if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = setTimeout(() => {
          nextChallenge();
        }, 1200);
      }
    },
    [submitNoteName, nextChallenge]
  );

  const handleStart = useCallback(() => {
    audioEngine.init();
    startSession();
  }, [startSession]);

  const handleReset = useCallback(() => {
    if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    resetSession();
  }, [resetSession]);

  const handleListenToMelody = useCallback(() => {
    if (!selectedMelodyId) return;
    const melody = getMelodyById(selectedMelodyId);
    if (!melody) return;

    audioEngine.init();
    let timeOffset = 0;
    const beatDuration = 60 / melody.tempo;

    for (const note of melody.notes) {
      const delay = timeOffset * 1000;
      setTimeout(() => {
        playPianoNote(note.noteIndex);
      }, delay);
      timeOffset += note.duration * beatDuration;
    }
  }, [selectedMelodyId]);

  const staffResults = results.map((r) => ({ correct: r.correct }));
  const hasSession = stats.startTime !== null;
  const isMelodyMode = mode === 'melody';
  const isNoteNamingMode = mode === 'note-naming';

  const modeDescriptions: Record<string, string> = {
    'note-drill': 'Identify notes as they appear on the staff',
    'note-naming': 'Type the name of the note shown on the staff',
    'interval': 'Play two-note intervals in order',
    'phrase': 'Read and play short melodies',
    'melody': 'Select a melody to practice',
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Title + selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Sight Reading</h1>
            <p className="text-sm text-gray-500">
              Read notes on the staff and play them
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SightReadingModeSelector />
            <DifficultySelector />
          </div>
        </div>

        {/* Input method selector */}
        {!isNoteNamingMode && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-600">Input:</span>
            <InputMethodSelector />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main area */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Melody selector (when no melody active) */}
            {isMelodyMode && !challengeActive && targetNotes.length === 0 && (
              <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
                <MelodySelector />
              </div>
            )}

            {/* Staff */}
            {(!isMelodyMode || targetNotes.length > 0) && (
              <div className="bg-[#1a1d27] rounded-xl p-6 border border-gray-800 flex flex-col items-center">
                {targetNotes.length > 0 ? (
                  <Staff
                    noteIndices={targetNotes}
                    currentNoteIndex={currentNoteIndex}
                    results={staffResults}
                    scrollable={isMelodyMode}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <p className="text-sm mb-4">
                      {modeDescriptions[mode] ?? ''}
                    </p>
                    <button
                      onClick={handleStart}
                      className="px-6 py-2.5 bg-white text-gray-900 rounded-lg font-medium
                                 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Start Practice
                    </button>
                  </div>
                )}

                <ResultFeedback />

                {hasSession && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {!challengeActive && targetNotes.length > 0 && (
                      <button
                        onClick={nextChallenge}
                        className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium
                                   hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {isMelodyMode ? 'Retry' : 'Next'}
                      </button>
                    )}
                    {isMelodyMode && targetNotes.length > 0 && (
                      <button
                        onClick={handleListenToMelody}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium
                                   hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        Listen
                      </button>
                    )}
                    {isMelodyMode && (
                      <button
                        onClick={() => { setSelectedMelody(null); handleReset(); }}
                        className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium
                                   hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        Back to Melodies
                      </button>
                    )}
                    {!isMelodyMode && (
                      <button
                        onClick={handleReset}
                        className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium
                                   hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Input area */}
            {isNoteNamingMode ? (
              <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
                <NoteNameInput
                  targetNoteIndex={targetNotes[currentNoteIndex] ?? 0}
                  onAnswer={handleNoteNameAnswer}
                  disabled={!challengeActive}
                />
              </div>
            ) : (
              <>
                {inputMethod === 'mic' && (
                  <MicIndicator
                    isListening={micInput.isListening}
                    error={micInput.error}
                    detectedFrequency={micInput.detectedFrequency}
                    onToggle={micInput.isListening ? micInput.stop : micInput.start}
                  />
                )}
                <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
                  <PianoKeyboard onNotePlay={handleNotePlay} activeNote={activeNote} />
                </div>
              </>
            )}

            {challengeActive && targetNotes.length > 0 && !isNoteNamingMode && (
              <div className="text-center text-xs text-gray-600">
                Target: {ALL_NOTES[targetNotes[currentNoteIndex]]?.name}
                <span className="ml-2 text-gray-700">(shown on staff above)</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <StatsPanel />

            {!isNoteNamingMode && inputMethod === 'keyboard' && (
              <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Keyboard</h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="text-gray-400">Lower octave:</span>{' '}
                    <kbd className="bg-gray-800 px-1 rounded">Z</kbd>-
                    <kbd className="bg-gray-800 px-1 rounded">M</kbd> = C3-B3
                  </p>
                  <p>
                    <span className="text-gray-400">Upper octave:</span>{' '}
                    <kbd className="bg-gray-800 px-1 rounded">Q</kbd>-
                    <kbd className="bg-gray-800 px-1 rounded">U</kbd> = C4-B4
                  </p>
                  <p className="text-gray-600 mt-2">
                    White keys on letter rows, black keys on the row above
                  </p>
                </div>
              </div>
            )}

            {isNoteNamingMode && (
              <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-2">How to play</h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Type the letter name of the note shown on the staff.</p>
                  <p>
                    <span className="text-gray-400">Natural notes:</span> A, B, C, D, E, F, G
                  </p>
                  <p>
                    <span className="text-gray-400">Sharps:</span> C#, D#, F#, G#, A#
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
