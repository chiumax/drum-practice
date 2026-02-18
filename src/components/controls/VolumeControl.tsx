'use client';

import { usePatternStore } from '@/lib/store/usePatternStore';

export function VolumeControl() {
  const tracks = usePatternStore((s) => s.currentPattern.tracks);
  const setTrackVolume = usePatternStore((s) => s.setTrackVolume);
  const toggleTrackMute = usePatternStore((s) => s.toggleTrackMute);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Volume</div>
      {tracks.map((track, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            onClick={() => toggleTrackMute(i)}
            className={`
              w-6 h-6 rounded text-xs font-bold flex items-center justify-center cursor-pointer transition-colors
              ${track.muted ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
            `}
            title={track.muted ? 'Unmute' : 'Mute'}
          >
            {track.muted ? 'M' : 'M'}
          </button>
          <span className="text-xs text-gray-400 w-16 truncate">{track.label}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(track.volume * 100)}
            onChange={(e) => setTrackVolume(i, parseInt(e.target.value, 10) / 100)}
            className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
            disabled={track.muted}
          />
          <span className="text-xs text-gray-500 w-8 text-right">
            {Math.round(track.volume * 100)}
          </span>
        </div>
      ))}
    </div>
  );
}
