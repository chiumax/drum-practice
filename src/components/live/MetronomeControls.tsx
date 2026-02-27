'use client';

import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { MetronomeMode } from '@/lib/live-practice/types';

const modes: { id: MetronomeMode; label: string }[] = [
  { id: 'off', label: 'Off' },
  { id: 'every-beat', label: 'All Beats' },
  { id: '2-and-4', label: '2 & 4' },
  { id: 'one-per-bar', label: '1/Bar' },
];

export function MetronomeControls() {
  const metronomeMode = useSettingsStore((s) => s.metronomeMode);
  const setMetronomeMode = useSettingsStore((s) => s.setMetronomeMode);
  const metronomeVolume = useSettingsStore((s) => s.metronomeVolume);
  const setMetronomeVolume = useSettingsStore((s) => s.setMetronomeVolume);
  const muteDrumSounds = useSettingsStore((s) => s.muteDrumSounds);
  const setMuteDrumSounds = useSettingsStore((s) => s.setMuteDrumSounds);
  const mutePatternPlayback = useSettingsStore((s) => s.mutePatternPlayback);
  const setMutePatternPlayback = useSettingsStore((s) => s.setMutePatternPlayback);

  return (
    <div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
        Metronome
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetronomeMode(m.id)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              metronomeMode === m.id
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      {metronomeMode !== 'off' && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Vol</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(metronomeVolume * 100)}
              onChange={(e) => setMetronomeVolume(parseInt(e.target.value, 10) / 100)}
              className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <button
              onClick={() => setMutePatternPlayback(!mutePatternPlayback)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                mutePatternPlayback
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {mutePatternPlayback ? 'Pattern Off' : 'Pattern On'}
            </button>
            <button
              onClick={() => setMuteDrumSounds(!muteDrumSounds)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                muteDrumSounds
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {muteDrumSounds ? 'Tap Sounds Off' : 'Tap Sounds On'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
