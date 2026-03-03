import { useEffect } from 'react';
import { KITS } from '../drumpad/types';
import { useDrumpadStore } from '../store/useDrumpadStore';
import { audioEngine } from '../audio/AudioEngine';

export function useDrumpadKeyboard() {
  const triggerPad = useDrumpadStore((s) => s.triggerPad);
  const releasePad = useDrumpadStore((s) => s.releasePad);
  const currentKit = useDrumpadStore((s) => s.currentKit);
  const setKit = useDrumpadStore((s) => s.setKit);

  useEffect(() => {
    const pads = KITS[currentKit].pads;
    const keyToPad = new Map(pads.map((p) => [p.keyCode, p.id]));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Kit switching with arrow keys
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setKit(Math.max(0, currentKit - 1));
        return;
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        setKit(Math.min(KITS.length - 1, currentKit + 1));
        return;
      }

      const padId = keyToPad.get(e.code);
      if (!padId) return;
      e.preventDefault();
      audioEngine.init();
      triggerPad(padId);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const padId = keyToPad.get(e.code);
      if (!padId) return;
      releasePad(padId);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerPad, releasePad, currentKit, setKit]);
}
