'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { LaunchPadGrid, LaunchPadControls } from '@/components/launchpad/LaunchPad';
import { useLaunchpadKeyboard } from '@/lib/hooks/useLaunchpadKeyboard';
import { useLaunchpadStore } from '@/lib/store/useLaunchpadStore';

export default function LaunchpadPage() {
  useLaunchpadKeyboard();

  // Load the first pack on mount
  const setPack = useLaunchpadStore((s) => s.setPack);
  const isLoaded = useLaunchpadStore((s) => s.isLoaded);
  useEffect(() => {
    if (!isLoaded) {
      setPack(0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Launchpad</h1>
          <p className="text-sm text-gray-500 mt-1">
            Play with keyboard or tap pads. Arrow keys switch chains.
          </p>
        </div>

        <LaunchPadControls />
        <LaunchPadGrid />
      </main>
    </div>
  );
}
