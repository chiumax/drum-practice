'use client';

import { useEffect } from 'react';
import { useTransportStore } from '../store/useTransportStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { playState, play, pause, stop, setBpm, bpm } =
        useTransportStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (playState === 'playing') {
            pause();
          } else {
            play();
          }
          break;
        case 'Escape':
          stop();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setBpm(bpm + (e.shiftKey ? 10 : 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setBpm(bpm - (e.shiftKey ? 10 : 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
