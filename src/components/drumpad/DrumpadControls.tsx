'use client';

import { useDrumpadStore } from '@/lib/store/useDrumpadStore';
import { KITS } from '@/lib/drumpad/types';
import { ROUTINES } from '@/lib/drumpad/routines';

export function DrumpadControls() {
  const isRecording = useDrumpadStore((s) => s.isRecording);
  const isPlaying = useDrumpadStore((s) => s.isPlaying);
  const isLooping = useDrumpadStore((s) => s.isLooping);
  const playbackSpeed = useDrumpadStore((s) => s.playbackSpeed);
  const recordedHits = useDrumpadStore((s) => s.recordedHits);
  const currentKit = useDrumpadStore((s) => s.currentKit);
  const activeRoutineName = useDrumpadStore((s) => s.activeRoutineName);
  const startRecording = useDrumpadStore((s) => s.startRecording);
  const stopRecording = useDrumpadStore((s) => s.stopRecording);
  const clearRecording = useDrumpadStore((s) => s.clearRecording);
  const startPlayback = useDrumpadStore((s) => s.startPlayback);
  const stopPlayback = useDrumpadStore((s) => s.stopPlayback);
  const toggleLoop = useDrumpadStore((s) => s.toggleLoop);
  const setPlaybackSpeed = useDrumpadStore((s) => s.setPlaybackSpeed);
  const setKit = useDrumpadStore((s) => s.setKit);
  const loadRoutine = useDrumpadStore((s) => s.loadRoutine);

  return (
    <div className="space-y-4">
      {/* Kit selector */}
      <div className="flex items-center justify-center gap-2">
        {KITS.map((kit, i) => (
          <button
            key={kit.name}
            onClick={() => setKit(i)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${currentKit === i
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }
            `}
          >
            {kit.name}
          </button>
        ))}
      </div>

      {/* Routines */}
      <div>
        <p className="text-center text-xs text-gray-500 mb-2">Routines</p>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {ROUTINES.map((routine) => (
            <button
              key={routine.name}
              onClick={() => loadRoutine(routine)}
              title={routine.description}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                ${activeRoutineName === routine.name
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                }
              `}
            >
              {routine.name}
              <span className="ml-1 text-gray-600">{routine.bpm}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recording controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Record */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${isRecording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
              : 'bg-gray-800 text-red-400 hover:bg-gray-700 border border-gray-700'
            }
          `}
          title={isRecording ? 'Stop recording' : 'Record'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="7" r="6" />
          </svg>
        </button>

        {/* Play/Stop */}
        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          disabled={recordedHits.length === 0}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${isPlaying
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
          title={isPlaying ? 'Stop' : 'Play'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="10" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5v11l9-5.5z" />
            </svg>
          )}
        </button>

        {/* Loop toggle */}
        <button
          onClick={toggleLoop}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${isLooping
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
              : 'bg-gray-800 text-gray-500 hover:bg-gray-700 border border-gray-700'
            }
          `}
          title={isLooping ? 'Loop on' : 'Loop off'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 2l2 2-2 2" />
            <path d="M3 8V6a2 2 0 012-2h8" />
            <path d="M5 14l-2-2 2-2" />
            <path d="M13 8v2a2 2 0 01-2 2H3" />
          </svg>
        </button>

        {/* Clear */}
        <button
          onClick={clearRecording}
          disabled={recordedHits.length === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Clear recording"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h10M5 4V2.5h4V4M3 4v8.5h8V4" />
          </svg>
        </button>
      </div>

      {/* Speed control */}
      {recordedHits.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs text-gray-500 w-12 text-right">Speed</span>
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.25}
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-xs text-gray-400 w-10">{playbackSpeed}x</span>
        </div>
      )}

      {/* Hit counter */}
      {recordedHits.length > 0 && (
        <p className="text-center text-xs text-gray-500">
          {recordedHits.length} hit{recordedHits.length !== 1 ? 's' : ''} recorded
        </p>
      )}
    </div>
  );
}
