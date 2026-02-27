'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PitchDetector } from '../audio/PitchDetector';

interface UseMicInputReturn {
  isListening: boolean;
  error: string | null;
  detectedFrequency: number | null;
  start: () => Promise<void>;
  stop: () => void;
}

export function useMicInput(
  onNoteDetected: (noteIndex: number) => void,
  enabled: boolean
): UseMicInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const detectorRef = useRef<PitchDetector | null>(null);
  const callbackRef = useRef(onNoteDetected);
  callbackRef.current = onNoteDetected;

  // Track the last note we fired so we don't fire the same note repeatedly
  const lastFiredRef = useRef<number | null>(null);
  const lastFiredTimeRef = useRef(0);

  const stop = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    setIsListening(false);
    setDetectedFrequency(null);
    lastFiredRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const detector = new PitchDetector();
      detectorRef.current = detector;

      await detector.start((noteIndex, frequency) => {
        setDetectedFrequency(frequency);

        // Avoid firing the same note within 500ms
        const now = Date.now();
        if (
          noteIndex === lastFiredRef.current &&
          now - lastFiredTimeRef.current < 500
        ) {
          return;
        }

        lastFiredRef.current = noteIndex;
        lastFiredTimeRef.current = now;
        callbackRef.current(noteIndex);
      });

      setIsListening(true);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Microphone access denied'
          : 'Could not access microphone';
      setError(msg);
      setIsListening(false);
    }
  }, []);

  // Auto-stop when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      stop();
    }
  }, [enabled, isListening, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stop();
        detectorRef.current = null;
      }
    };
  }, []);

  return { isListening, error, detectedFrequency, start, stop };
}
