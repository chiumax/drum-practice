'use client';

import { usePracticeStore } from '@/lib/store/usePracticeStore';

export function TempoRampConfig() {
  const config = usePracticeStore((s) => s.tempoRampConfig);
  const setConfig = usePracticeStore((s) => s.setTempoRampConfig);
  const mode = usePracticeStore((s) => s.mode);

  if (mode !== 'tempo-ramp') return null;

  return (
    <div className="grid grid-cols-2 gap-3 bg-gray-800/50 rounded-lg p-3">
      <div>
        <label className="text-xs text-gray-500 block mb-1">Start BPM</label>
        <input
          type="number"
          value={config.startBpm}
          onChange={(e) => setConfig({ startBpm: parseInt(e.target.value, 10) || 60 })}
          className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-gray-500"
          min={40}
          max={240}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">End BPM</label>
        <input
          type="number"
          value={config.endBpm}
          onChange={(e) => setConfig({ endBpm: parseInt(e.target.value, 10) || 120 })}
          className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-gray-500"
          min={40}
          max={300}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Increase by</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={config.incrementBpm}
            onChange={(e) => setConfig({ incrementBpm: parseInt(e.target.value, 10) || 1 })}
            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-gray-500"
            min={1}
            max={20}
          />
          <span className="text-xs text-gray-500 whitespace-nowrap">BPM</span>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Every</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={config.barsPerIncrement}
            onChange={(e) => setConfig({ barsPerIncrement: parseInt(e.target.value, 10) || 1 })}
            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-gray-500"
            min={1}
            max={16}
          />
          <span className="text-xs text-gray-500 whitespace-nowrap">bars</span>
        </div>
      </div>
    </div>
  );
}
