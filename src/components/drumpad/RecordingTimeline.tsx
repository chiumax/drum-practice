'use client';

import { useDrumpadStore } from '@/lib/store/useDrumpadStore';
import { KITS } from '@/lib/drumpad/types';

export function RecordingTimeline() {
  const recordedHits = useDrumpadStore((s) => s.recordedHits);
  const currentKit = useDrumpadStore((s) => s.currentKit);

  if (recordedHits.length === 0) return null;

  const lastTime = recordedHits[recordedHits.length - 1].timestamp;
  const duration = Math.max(lastTime, 0.5);

  // Build a map of padId -> color
  const padColorMap = new Map(
    KITS[currentKit].pads.map((p) => [p.id, p.color])
  );

  // Color classes for the dots
  const dotColorClass: Record<string, string> = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
    green: 'bg-green-400',
  };

  return (
    <div className="mt-4">
      <div className="relative h-8 bg-gray-800/60 rounded-lg border border-gray-700/50 overflow-hidden">
        {recordedHits.map((hit, i) => {
          const left = (hit.timestamp / duration) * 100;
          const color = padColorMap.get(hit.padId) ?? 'cyan';
          return (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-sm ${dotColorClass[color] ?? 'bg-gray-400'}`}
              style={{ left: `${Math.min(left, 99)}%`, opacity: 0.5 + hit.velocity * 0.5 }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-600">0s</span>
        <span className="text-[10px] text-gray-600">{duration.toFixed(1)}s</span>
      </div>
    </div>
  );
}
