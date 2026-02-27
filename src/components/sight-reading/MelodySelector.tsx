'use client';

import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { getMelodiesByDifficulty } from '@/lib/sight-reading/melodies';

export function MelodySelector() {
  const difficulty = useSightReadingStore((s) => s.difficulty);
  const selectedMelodyId = useSightReadingStore((s) => s.selectedMelodyId);
  const setSelectedMelody = useSightReadingStore((s) => s.setSelectedMelody);
  const startMelody = useSightReadingStore((s) => s.startMelody);

  const melodies = getMelodiesByDifficulty(difficulty);

  if (melodies.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No melodies for this difficulty yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {melodies.map((m) => {
        const isSelected = selectedMelodyId === m.id;
        return (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMelody(m.id);
              startMelody();
            }}
            className={`text-left p-3 rounded-lg border transition-all cursor-pointer
              ${isSelected
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-800 bg-gray-800/30 hover:bg-gray-800/60 hover:border-gray-700'
              }`}
          >
            <div className="font-medium text-sm text-white">{m.title}</div>
            {m.composer && (
              <div className="text-xs text-gray-500 mt-0.5">{m.composer}</div>
            )}
            <div className="text-xs text-gray-600 mt-1">
              {m.notes.length} notes &middot; {m.tempo} BPM
            </div>
          </button>
        );
      })}
    </div>
  );
}
