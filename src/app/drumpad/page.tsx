'use client';

import { Header } from '@/components/Header';
import { PadGrid } from '@/components/drumpad/PadGrid';
import { DrumpadControls } from '@/components/drumpad/DrumpadControls';
import { RecordingTimeline } from '@/components/drumpad/RecordingTimeline';
import { useDrumpadKeyboard } from '@/lib/hooks/useDrumpadKeyboard';

export default function DrumpadPage() {
  useDrumpadKeyboard();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Drumpad</h1>
          <p className="text-sm text-gray-500 mt-1">
            Play with keyboard (1-4, Q-R, A-D, Z-V) or tap pads. Arrow keys switch kits.
          </p>
        </div>

        <PadGrid />
        <DrumpadControls />
        <RecordingTimeline />
      </main>
    </div>
  );
}
