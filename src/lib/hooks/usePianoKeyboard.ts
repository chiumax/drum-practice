'use client';

import { useEffect } from 'react';
import { KEY_TO_NOTE } from '@/lib/sight-reading/notes';

export function usePianoKeyboard(
  onNotePlay: (noteIndex: number) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Prevent repeat (key held down)
      if (pressedKeys.has(key)) return;

      const noteIndex = KEY_TO_NOTE[key];
      if (noteIndex !== undefined) {
        e.preventDefault();
        pressedKeys.add(key);
        onNotePlay(noteIndex);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNotePlay, enabled]);
}
