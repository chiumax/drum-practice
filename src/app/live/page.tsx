'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BeatGrid } from '@/components/sequencer/BeatGrid';
import { TransportControls } from '@/components/controls/TransportControls';
import { BpmControl } from '@/components/controls/BpmControl';
import { TapPadPanel } from '@/components/live/TapPadPanel';
import { LiveStatsPanel } from '@/components/live/LiveStatsPanel';
import { LiveResultsModal } from '@/components/live/LiveResultsModal';
import { ModeSelector } from '@/components/live/ModeSelector';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { useTransportStore, scheduler } from '@/lib/store/useTransportStore';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { useLiveKeyboardHandler } from '@/lib/hooks/useLiveKeyboardHandler';
import { TapMatcher } from '@/lib/live-practice/TapMatcher';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { TimingGrade } from '@/lib/live-practice/types';
import { Track } from '@/lib/patterns/types';

export default function LivePracticePage() {
  const pattern = usePatternStore((s) => s.currentPattern);
  const playState = useTransportStore((s) => s.playState);
  const play = useTransportStore((s) => s.play);
  const stop = useTransportStore((s) => s.stop);
  const bpm = useTransportStore((s) => s.bpm);

  const isActive = useLivePracticeStore((s) => s.isActive);
  const startSession = useLivePracticeStore((s) => s.startSession);
  const endSession = useLivePracticeStore((s) => s.endSession);
  const mode = useLivePracticeStore((s) => s.mode);
  const focusedTrack = useLivePracticeStore((s) => s.focusedTrack);
  const stepAccuraciesRaw = useLivePracticeStore((s) => s.stepAccuracies);
  const recordMiss = useLivePracticeStore((s) => s.recordMiss);
  const resetStepAccuracies = useLivePracticeStore((s) => s.resetStepAccuracies);
  const stats = useLivePracticeStore((s) => s.stats);

  const [showResults, setShowResults] = useState(false);

  const tapMatcherRef = useRef<TapMatcher | null>(null);
  const sweepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize TapMatcher
  if (!tapMatcherRef.current) {
    tapMatcherRef.current = new TapMatcher();
  }

  // Convert stepAccuracies to the format BeatGrid expects: Record<string, TimingGrade>
  const stepAccuracies = useMemo(() => {
    const result: Record<string, TimingGrade> = {};
    for (const [key, acc] of Object.entries(stepAccuraciesRaw)) {
      result[key] = acc.grade;
    }
    return result;
  }, [stepAccuraciesRaw]);

  // Register step listener for feeding expected beats to TapMatcher
  useEffect(() => {
    const unsubscribe = scheduler.addStepListener((step, time) => {
      const tapMatcher = tapMatcherRef.current;
      if (!tapMatcher || !useLivePracticeStore.getState().isActive) return;

      const liveMode = useLivePracticeStore.getState().mode;
      const focused = useLivePracticeStore.getState().focusedTrack;
      const currentPattern = usePatternStore.getState().currentPattern;

      currentPattern.tracks.forEach((track: Track) => {
        const s = track.steps[step];
        if (!s || !s.active) return;

        // In single-track mode, only expect beats for the focused instrument
        if (liveMode === 'single-track' && focused && track.instrumentId !== focused) return;

        tapMatcher.addExpectedBeat(step, time, track.instrumentId);
      });
    });

    return unsubscribe;
  }, []);

  // Sweep for misses periodically
  useEffect(() => {
    if (isActive) {
      sweepIntervalRef.current = setInterval(() => {
        const tapMatcher = tapMatcherRef.current;
        if (!tapMatcher) return;
        const misses = tapMatcher.sweepMisses(audioEngine.currentTime);
        misses.forEach((miss) => {
          recordMiss(miss.step, miss.instrumentId);
        });
      }, 50);
    } else {
      if (sweepIntervalRef.current) {
        clearInterval(sweepIntervalRef.current);
      }
    }

    return () => {
      if (sweepIntervalRef.current) {
        clearInterval(sweepIntervalRef.current);
      }
    };
  }, [isActive, recordMiss]);

  // Reset step accuracy display each bar (so colors don't pile up forever)
  useEffect(() => {
    const unsubscribe = scheduler.addStepListener((step) => {
      if (step === 0 && useLivePracticeStore.getState().isActive) {
        useLivePracticeStore.getState().resetStepAccuracies();
      }
    });
    return unsubscribe;
  }, []);

  // Handle keyboard taps
  useLiveKeyboardHandler(tapMatcherRef.current, isActive);

  // Handle play/stop with session tracking
  const handlePlay = useCallback(() => {
    tapMatcherRef.current?.reset();
    startSession();
    resetStepAccuracies();
    play();
  }, [play, startSession, resetStepAccuracies]);

  const handleStop = useCallback(() => {
    stop();
    // Final sweep for any remaining expected beats
    if (tapMatcherRef.current) {
      const misses = tapMatcherRef.current.sweepMisses(Infinity);
      const rm = useLivePracticeStore.getState().recordMiss;
      misses.forEach((miss) => rm(miss.step, miss.instrumentId));
    }
    endSession();
    // Show results if there was data
    if (useLivePracticeStore.getState().stats.totalExpected > 0) {
      setShowResults(true);
    }
  }, [stop, endSession]);

  const handleRetry = useCallback(() => {
    setShowResults(false);
    handlePlay();
  }, [handlePlay]);

  const router = useRouter();
  const handleBackToPatterns = useCallback(() => {
    setShowResults(false);
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Pattern info + mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold">{pattern.name}</h1>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {pattern.timeSignature.beats}/{pattern.timeSignature.noteValue}
              </span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {pattern.subdivision}
              </span>
            </div>
            <p className="text-sm text-gray-500">{pattern.description}</p>
          </div>
          <ModeSelector />
        </div>

        {/* Beat grid with accuracy overlay */}
        <div className="mb-4 overflow-x-auto">
          <BeatGrid stepAccuracies={isActive || stats.totalExpected > 0 ? stepAccuracies : undefined} />
        </div>

        {/* Controls + pads + stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Transport + BPM */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                {/* Custom play/stop that manages sessions */}
                <button
                  onClick={playState === 'playing' ? handleStop : handlePlay}
                  className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center
                             hover:bg-gray-200 active:scale-95 transition-all cursor-pointer shadow-lg"
                  aria-label={playState === 'playing' ? 'Stop' : 'Start'}
                >
                  {playState === 'playing' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="1" y="1" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3.5L16.5 10L5 16.5V3.5Z" />
                    </svg>
                  )}
                </button>
                {isActive && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Live</span>
                  </div>
                )}
              </div>
              <BpmControl />
            </div>
          </div>

          {/* Tap pads */}
          <TapPadPanel tapMatcher={tapMatcherRef.current} isActive={isActive} />

          {/* Stats */}
          <LiveStatsPanel />
        </div>

        {/* Help text */}
        <div className="mt-4 text-center text-xs text-gray-600">
          Press the mapped keys to tap along with the beat.
          <span className="mx-2">|</span>
          <span className="bg-gray-800/50 px-2 py-1 rounded">D</span> Kick
          <span className="mx-1">|</span>
          <span className="bg-gray-800/50 px-2 py-1 rounded">F</span> Snare
          <span className="mx-1">|</span>
          <span className="bg-gray-800/50 px-2 py-1 rounded">J</span> Hi-Hat
        </div>
      </main>

      {/* Results modal */}
      <LiveResultsModal
        isOpen={showResults}
        onRetry={handleRetry}
        onClose={handleBackToPatterns}
      />
    </div>
  );
}
