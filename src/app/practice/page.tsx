'use client';

import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { BeatGrid } from '@/components/sequencer/BeatGrid';
import { TransportControls } from '@/components/controls/TransportControls';
import { BpmControl } from '@/components/controls/BpmControl';
import { VolumeControl } from '@/components/controls/VolumeControl';
import { SwingControl } from '@/components/controls/SwingControl';
import { PracticeModeSelector } from '@/components/practice/PracticeModeSelector';
import { TempoRampConfig } from '@/components/practice/TempoRampConfig';
import { PracticeStats } from '@/components/practice/PracticeStats';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { useTransportStore } from '@/lib/store/useTransportStore';
import { usePracticeStore } from '@/lib/store/usePracticeStore';
import { usePracticeHistoryStore } from '@/lib/store/usePracticeHistoryStore';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export default function PracticePage() {
  const pattern = usePatternStore((s) => s.currentPattern);
  const isModified = usePatternStore((s) => s.isModified);
  const resetPattern = usePatternStore((s) => s.resetPattern);
  const playState = useTransportStore((s) => s.playState);
  const stop = useTransportStore((s) => s.stop);
  const play = useTransportStore((s) => s.play);
  const bpm = useTransportStore((s) => s.bpm);
  const setBpm = useTransportStore((s) => s.setBpm);
  const practiceMode = usePracticeStore((s) => s.mode);
  const tempoRampConfig = usePracticeStore((s) => s.tempoRampConfig);
  const startSession = usePracticeStore((s) => s.startSession);
  const addHistorySession = usePracticeHistoryStore((s) => s.addSession);

  const sessionStartRef = useRef<number>(0);

  useKeyboardShortcuts();

  // When starting playback in tempo-ramp mode, set BPM to start value
  useEffect(() => {
    if (playState === 'playing' && practiceMode === 'tempo-ramp') {
      startSession(bpm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playState]);

  // Track session start/stop for history
  useEffect(() => {
    if (playState === 'playing') {
      sessionStartRef.current = Date.now();
    } else if (playState === 'stopped' && sessionStartRef.current !== 0) {
      const endTime = Date.now();
      const durationMs = endTime - sessionStartRef.current;
      if (durationMs > 5000) {
        const currentPattern = usePatternStore.getState().currentPattern;
        const currentBpm = useTransportStore.getState().bpm;
        const mode = usePracticeStore.getState().mode;
        addHistorySession({
          patternId: currentPattern.id,
          patternName: currentPattern.name,
          mode,
          startedAt: sessionStartRef.current,
          endedAt: endTime,
          durationMs,
          bpm: currentBpm,
          bpmStart: mode === 'tempo-ramp' ? tempoRampConfig.startBpm : undefined,
          bpmEnd: mode === 'tempo-ramp' ? tempoRampConfig.endBpm : undefined,
          accuracy: null,
          stats: null,
        });
      }
      sessionStartRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playState]);

  const handlePlayWithRamp = () => {
    if (practiceMode === 'tempo-ramp' && playState !== 'playing') {
      setBpm(tempoRampConfig.startBpm);
      startSession(tempoRampConfig.startBpm);
    }
    play();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Pattern info */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold">{pattern.name}</h1>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {pattern.timeSignature.beats}/{pattern.timeSignature.noteValue}
            </span>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {pattern.subdivision}
            </span>
            {isModified && (
              <button
                onClick={() => { stop(); resetPattern(); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">{pattern.description}</p>
        </div>

        {/* Beat grid */}
        <div className="mb-6 overflow-x-auto">
          <BeatGrid />
        </div>

        {/* Controls grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Transport + Practice mode */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <TransportControls />
                <PracticeStats />
              </div>
              <div className="flex flex-col gap-3">
                <PracticeModeSelector />
                <TempoRampConfig />
              </div>
            </div>
          </div>

          {/* Middle column: BPM */}
          <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
            <BpmControl />
            <div className="mt-4">
              <SwingControl />
            </div>
          </div>

          {/* Right column: Volumes */}
          <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
            <VolumeControl />
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center text-xs text-gray-600">
          <span className="bg-gray-800/50 px-2 py-1 rounded">Space</span> Play/Pause
          <span className="mx-2">|</span>
          <span className="bg-gray-800/50 px-2 py-1 rounded">Esc</span> Stop
          <span className="mx-2">|</span>
          <span className="bg-gray-800/50 px-2 py-1 rounded">&uarr;&darr;</span> BPM
          <span className="mx-2">|</span>
          Click grid cells to toggle
        </div>
      </main>
    </div>
  );
}
