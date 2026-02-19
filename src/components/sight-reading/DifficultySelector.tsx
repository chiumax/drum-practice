'use client';

import { useSightReadingStore } from '@/lib/store/useSightReadingStore';
import { Difficulty } from '@/lib/sight-reading/notes';

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export function DifficultySelector() {
  const difficulty = useSightReadingStore((s) => s.difficulty);
  const setDifficulty = useSightReadingStore((s) => s.setDifficulty);

  return (
    <div className="flex gap-1">
      {difficulties.map((d) => (
        <button
          key={d.id}
          onClick={() => setDifficulty(d.id)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${difficulty === d.id
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }
          `}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
