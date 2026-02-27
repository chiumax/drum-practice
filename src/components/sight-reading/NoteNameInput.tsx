'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ALL_NOTES } from '@/lib/sight-reading/notes';

interface NoteNameInputProps {
  targetNoteIndex: number;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export function NoteNameInput({ targetNoteIndex, onAnswer, disabled }: NoteNameInputProps) {
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled, targetNoteIndex]);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  const submit = useCallback(
    (input: string) => {
      if (disabled) return;

      const noteInfo = ALL_NOTES[targetNoteIndex];
      if (!noteInfo) return;

      const targetName = noteInfo.name.replace(/\d+$/, '');
      const correct = input.toUpperCase() === targetName.toUpperCase();

      setFeedback(correct ? 'correct' : 'wrong');
      onAnswer(correct);

      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      feedbackTimeout.current = setTimeout(() => {
        setFeedback(null);
        setValue('');
        inputRef.current?.focus();
      }, 400);
    },
    [disabled, targetNoteIndex, onAnswer]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const key = e.key.toUpperCase();

    // Single letter A-G submits immediately (for natural notes)
    if (/^[A-G]$/i.test(key) && value === '') {
      const noteInfo = ALL_NOTES[targetNoteIndex];
      if (noteInfo && !noteInfo.isSharp) {
        // Natural note — submit immediately
        e.preventDefault();
        submit(key);
        return;
      }
      // Sharp note — let them type the letter, wait for possible #
      setValue(key);
      e.preventDefault();
      return;
    }

    // # after a letter submits as sharp
    if (key === '#' && /^[A-G]$/i.test(value)) {
      e.preventDefault();
      submit(value + '#');
      return;
    }

    // If they typed a letter and then press another letter or Enter, submit what they have
    if (/^[A-G]$/i.test(value)) {
      if (key === 'ENTER' || /^[A-G]$/i.test(key)) {
        e.preventDefault();
        submit(value);
        // If they pressed another letter, don't start a new input yet
        return;
      }
    }
  };

  const borderColor =
    feedback === 'correct'
      ? 'border-green-500 bg-green-500/10'
      : feedback === 'wrong'
      ? 'border-red-500 bg-red-500/10'
      : 'border-gray-700 bg-gray-900';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-gray-400">Type the note name</div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? '—' : 'A-G'}
        className={`w-24 h-16 text-center text-3xl font-bold rounded-xl border-2
          ${borderColor} text-white outline-none transition-all
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'focus:border-blue-500'}`}
      />
      <div className="text-xs text-gray-600">
        Type A-G{' '}
        <span className="text-gray-700">(add # for sharps)</span>
      </div>
    </div>
  );
}
