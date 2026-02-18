'use client';

import { useEffect } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { playInstrument } from '../audio/DrumSynth';
import { useLivePracticeStore } from '../store/useLivePracticeStore';
import { TapMatcher } from '../live-practice/TapMatcher';

export function useLiveKeyboardHandler(
  tapMatcher: TapMatcher | null,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !tapMatcher) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { keyMappings } = useLivePracticeStore.getState();
      const mapping = keyMappings.find((m) => m.key === e.code);
      if (!mapping) return;

      e.preventDefault();

      const tapTime = audioEngine.currentTime;

      // Immediate audio feedback
      playInstrument(mapping.instrumentId, tapTime, 0.8, 0.8);

      // Process tap through matcher
      const tapEvent = tapMatcher.processTap(tapTime, mapping.instrumentId);

      // Update store
      const store = useLivePracticeStore.getState();
      store.recordTap(tapEvent);
      if (tapEvent.matchedStep !== null) {
        store.setStepAccuracy(
          tapEvent.matchedStep,
          mapping.instrumentId,
          tapEvent.grade,
          tapEvent.offset
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, tapMatcher]);
}
