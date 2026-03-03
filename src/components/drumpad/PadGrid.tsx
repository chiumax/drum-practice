'use client';

import { KITS } from '@/lib/drumpad/types';
import { useDrumpadStore } from '@/lib/store/useDrumpadStore';
import { DrumPad } from './DrumPad';

export function PadGrid() {
  const currentKit = useDrumpadStore((s) => s.currentKit);
  const activePads = useDrumpadStore((s) => s.activePads);
  const triggerPad = useDrumpadStore((s) => s.triggerPad);

  const pads = KITS[currentKit].pads;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
      {pads.map((pad) => (
        <DrumPad
          key={`${currentKit}-${pad.keyCode}`}
          config={pad}
          isActive={activePads.has(pad.id)}
          onTrigger={triggerPad}
        />
      ))}
    </div>
  );
}
