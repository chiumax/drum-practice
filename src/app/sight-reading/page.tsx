'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Staff } from '@/components/sight-reading/Staff';
import { PianoKeyboard } from '@/components/sight-reading/PianoKeyboard';
import { SightReadingModeSelector } from '@/components/sight-reading/ModeSelector';
import { DifficultySelector } from '@/components/sight-reading/DifficultySelector';
import { StatsPanel } from '@/components/sight-reading/StatsPanel';
import { ResultFeedback } from '@/components/sight-reading/ResultFeedback';
import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { usePianoKeyboard } from '@/lib/hooks/usePianoKeyboard';
import { playPianoNote, playErrorBuzz } from '@/lib/audio/PianoSynth';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { ALL_NOTES } from '@/lib/sight-reading/notes';

export default function SightReadingPage() {
  const mode = useSightReadingStore((s) => s.mode);
  const targetNotes = useSightReadingStore((s) => s.targetNotes);
  const currentNoteIndex = useSightReadingStore((s) => s.currentNoteIndex);
  const challengeActive = useSightReadingStore((s) => s.challengeActive);
  const results = useSightReadingStore((s) => s.results);
  const stats = useSightReadingStore((s) => s.stats);
  const startSession = useSightReadingStore((s) => s.startSession);
  const nextChallenge = useSightReadingStore((s) => s.nextChallenge);
  const submitNote = useSightReadingStore((s) => s.submitNote);
  const resetSession = useSightReadingStore((s) => s.resetSession);

  const [activeNote, setActiveNote] = useState<number | null>(null);
  const activeNoteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (activeNoteTimeout.current) clearTimeout(activeNoteTimeout.current);
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    };
  }, []);

  const handleNotePlay = useCallback(
    (noteIndex: number) => {
      // Ensure audio context is initialized
      audioEngine.init();

      // Visual feedback — flash the key
      setActiveNote(noteIndex);
      if (activeNoteTimeout.current) clearTimeout(activeNoteTimeout.current);
      activeNoteTimeout.current = setTimeout(() => setActiveNote(null), 200);

      // If no active challenge, just play the sound
      if (!challengeActive) {
        playPianoNote(noteIndex);
        return;
      }

      // Get current state directly to avoid stale closures
      const state = useSightReadingStore.getState();
      const targetNote = state.targetNotes[state.currentNoteIndex];
      const correct = noteIndex === targetNote;

      if (correct) {
        playPianoNote(noteIndex);
      } else {
        playPianoNote(noteIndex, 0.3); // play wrong note quietly
        playErrorBuzz();
      }

      submitNote(noteIndex);

      // Auto-advance after completing a challenge
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

  // Keyboard input
  usePianoKeyboard(handleNotePlay, true);

  const handleStart = useCallback(() => {
    audioEngine.init();
    startSession();
  }, [startSession]);

  const handleReset = useCallback(() => {
    if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    resetSession();
  }, [resetSession]);

  // Build results array for staff coloring
  const staffResults = results.map((r) => ({ correct: r.correct }));

  const hasSession = stats.startTime !== null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Title + mode/difficulty selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Sight Reading</h1>
            <p className="text-sm text-gray-500">
              Read notes on the staff and play them on the piano
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SightReadingModeSelector />
            <DifficultySelector />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main area: staff + feedback + piano */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Staff */}
            <div className="bg-[#1a1d27] rounded-xl p-6 border border-gray-800 flex flex-col items-center">
              {targetNotes.length > 0 ? (
                <Staff
                  noteIndices={targetNotes}
                  currentNoteIndex={currentNoteIndex}
                  results={staffResults}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <p className="text-sm mb-4">
                    {mode === 'note-drill' && 'Identify notes as they appear on the staff'}
                    {mode === 'interval' && 'Play two-note intervals in order'}
                    {mode === 'phrase' && 'Read and play short melodies'}
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

              {/* Result feedback */}
              <ResultFeedback />

              {/* Controls */}
              {hasSession && (
                <div className="flex gap-3 mt-2">
                  {!challengeActive && targetNotes.length > 0 && (
                    <button
                      onClick={nextChallenge}
                      className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium
                                 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium
                               hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Piano */}
            <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
              <PianoKeyboard onNotePlay={handleNotePlay} activeNote={activeNote} />
            </div>

            {/* Note name hint for current target */}
            {challengeActive && targetNotes.length > 0 && (
              <div className="text-center text-xs text-gray-600">
                Target: {ALL_NOTES[targetNotes[currentNoteIndex]]?.name}
                <span className="ml-2 text-gray-700">(shown on staff above)</span>
              </div>
            )}
          </div>

          {/* Sidebar: Stats */}
          <div className="flex flex-col gap-4">
            <StatsPanel />

            {/* Keyboard help */}
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
          </div>
        </div>
      </main>
    </div>
  );
}
