'use client';

import { useEffect, useState } from 'react';
import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { ALL_NOTES, getIntervalName } from '@/lib/sight-reading/notes';

export function ResultFeedback() {
  const lastResult = useSightReadingStore((s) => s.lastResult);
  const results = useSightReadingStore((s) => s.results);
  const targetNotes = useSightReadingStore((s) => s.targetNotes);
  const challengeActive = useSightReadingStore((s) => s.challengeActive);
  const mode = useSightReadingStore((s) => s.mode);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastResult) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [lastResult, results.length]);

  // Show interval name after completing an interval challenge
  const showIntervalName =
    mode === 'interval' &&
    !challengeActive &&
    targetNotes.length === 2 &&
    results.length >= 2;

  const intervalSemitones = showIntervalName
    ? Math.abs(
        ALL_NOTES[targetNotes[1]].midiNumber -
          ALL_NOTES[targetNotes[0]].midiNumber
      )
    : 0;

  return (
    <div className="h-10 flex items-center justify-center gap-3">
      {visible && lastResult && (
        <span
          className={`
            text-lg font-bold animate-pulse
            ${lastResult === 'correct' ? 'text-green-400' : 'text-red-400'}
          `}
        >
          {lastResult === 'correct' ? 'Correct!' : 'Wrong'}
        </span>
      )}
      {showIntervalName && (
        <span className="text-sm text-indigo-400 font-medium">
          {getIntervalName(intervalSemitones)}
        </span>
      )}
      {!challengeActive && results.length > 0 && mode === 'phrase' && (
        <span className="text-sm text-gray-400">
          {results.filter((r) => r.correct).length}/{results.length} correct
        </span>
      )}
    </div>
  );
}
