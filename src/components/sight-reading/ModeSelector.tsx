'use client';

import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { SightReadingMode } from '@/lib/sight-reading/generator';

const modes: { id: SightReadingMode; label: string; desc: string }[] = [
  { id: 'note-drill', label: 'Note Drill', desc: 'Identify single notes' },
  { id: 'note-naming', label: 'Name Notes', desc: 'Type the note letter' },
  { id: 'interval', label: 'Intervals', desc: 'Play two-note intervals' },
  { id: 'phrase', label: 'Phrases', desc: 'Read short melodies' },
  { id: 'melody', label: 'Melodies', desc: 'Practice popular songs' },
];

export function SightReadingModeSelector() {
  const mode = useSightReadingStore((s) => s.mode);
  const setMode = useSightReadingStore((s) => s.setMode);

  return (
    <div className="flex gap-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${mode === m.id
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }
          `}
          title={m.desc}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
