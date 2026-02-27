'use client';

import { ALL_NOTES } from '@/lib/sight-reading/notes';
import { frequencyToNoteIndex } from '@/lib/audio/PitchDetector';

interface MicIndicatorProps {
  isListening: boolean;
  error: string | null;
  detectedFrequency: number | null;
  onToggle: () => void;
}

export function MicIndicator({
  isListening,
  error,
  detectedFrequency,
  onToggle,
}: MicIndicatorProps) {
  const noteIndex = detectedFrequency ? frequencyToNoteIndex(detectedFrequency) : null;
  const noteName = noteIndex !== null ? ALL_NOTES[noteIndex]?.name : null;

  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer
              ${isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <div>
            <div className="text-sm font-medium text-gray-300">
              {isListening ? 'Listening...' : 'Microphone'}
            </div>
            {error && <div className="text-xs text-red-400">{error}</div>}
            {!error && !isListening && (
              <div className="text-xs text-gray-600">Click to start</div>
            )}
          </div>
        </div>

        {isListening && (
          <div className="text-right">
            {detectedFrequency ? (
              <div>
                <div className="text-lg font-bold text-white">{noteName ?? '—'}</div>
                <div className="text-xs text-gray-600">{Math.round(detectedFrequency)} Hz</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Play a note...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
