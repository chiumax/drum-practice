'use client';

import { useSightReadingStore, InputMethod } from '@/lib/store/useSightReadingStore';

const methods: { id: InputMethod; label: string }[] = [
  { id: 'keyboard', label: 'Computer Keys' },
  { id: 'piano-keys', label: 'Virtual Piano' },
  { id: 'mic', label: 'Microphone' },
];

export function InputMethodSelector() {
  const inputMethod = useSightReadingStore((s) => s.inputMethod);
  const setInputMethod = useSightReadingStore((s) => s.setInputMethod);

  return (
    <div className="flex gap-1">
      {methods.map((m) => (
        <button
          key={m.id}
          onClick={() => setInputMethod(m.id)}
          className={`
            px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer
            ${inputMethod === m.id
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800/50 text-gray-500 hover:bg-gray-800 hover:text-gray-400'
            }
          `}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
