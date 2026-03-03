import { useEffect } from 'react';
import { PAD_KEY_CODES } from '../launchpad/types';
import { useLaunchpadStore } from '../store/useLaunchpadStore';
import { audioEngine } from '../audio/AudioEngine';

// Build reverse map: KeyboardEvent.code -> pad index
const codeToPadIndex = new Map<string, number>();
PAD_KEY_CODES.forEach((code, index) => {
  if (code) codeToPadIndex.set(code, index);
});

// Arrow key -> chain mapping (matches original Launchpad)
const CHAIN_KEYS: Record<string, number> = {
  ArrowLeft: 0,
  ArrowUp: 1,
  ArrowRight: 3,
  ArrowDown: 2,
};

export function useLaunchpadKeyboard() {
  const triggerPad = useLaunchpadStore((s) => s.triggerPad);
  const releasePad = useLaunchpadStore((s) => s.releasePad);
  const setChain = useLaunchpadStore((s) => s.setChain);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Chain switching with arrow keys
      const chain = CHAIN_KEYS[e.code];
      if (chain !== undefined) {
        e.preventDefault();
        setChain(chain);
        return;
      }

      const padIndex = codeToPadIndex.get(e.code);
      if (padIndex === undefined) return;
      e.preventDefault();
      audioEngine.init();
      triggerPad(padIndex);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const padIndex = codeToPadIndex.get(e.code);
      if (padIndex === undefined) return;
      releasePad(padIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerPad, releasePad, setChain]);
}
