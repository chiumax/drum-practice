'use client';

import { usePracticeStore } from '@/lib/store/usePracticeStore';
import { PracticeMode } from '@/lib/patterns/types';

const modes: { id: PracticeMode; label: string; description: string }[] = [
  { id: 'loop', label: 'Loop', description: 'Repeat pattern continuously' },
  { id: 'tempo-ramp', label: 'Tempo Ramp', description: 'Gradually increase speed' },
];

export function PracticeModeSelector() {
  const mode = usePracticeStore((s) => s.mode);
  const setMode = usePracticeStore((s) => s.setMode);

  return (
    <div className="flex gap-2">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
            ${mode === m.id
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }
          `}
          title={m.description}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
