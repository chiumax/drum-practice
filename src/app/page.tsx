'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { allPatterns, categories } from '@/lib/patterns';
import { usePatternStore } from '@/lib/store/usePatternStore';
import { useTransportStore } from '@/lib/store/useTransportStore';
import { PatternCategory } from '@/lib/patterns/types';
import { DueForReviewBanner } from '@/components/home/DueForReviewBanner';

const categoryColors: Record<string, string> = {
  rock: 'bg-red-500/20 text-red-400',
  funk: 'bg-purple-500/20 text-purple-400',
  latin: 'bg-yellow-500/20 text-yellow-400',
  world: 'bg-green-500/20 text-green-400',
  rudiment: 'bg-cyan-500/20 text-cyan-400',
  jazz: 'bg-amber-500/20 text-amber-400',
  electronic: 'bg-blue-500/20 text-blue-400',
  polyrhythm: 'bg-pink-500/20 text-pink-400',
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<PatternCategory | 'all'>('all');
  const loadPattern = usePatternStore((s) => s.loadPattern);
  const setBpm = useTransportStore((s) => s.setBpm);
  const stop = useTransportStore((s) => s.stop);
  const router = useRouter();

  const filtered = activeCategory === 'all'
    ? allPatterns
    : allPatterns.filter((p) => p.category === activeCategory);

  const handleSelect = (patternId: string) => {
    const pattern = allPatterns.find((p) => p.id === patternId);
    if (!pattern) return;
    stop();
    loadPattern(pattern);
    setBpm(pattern.defaultBpm);
    router.push('/practice');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Pattern Library</h1>
          <p className="text-gray-400 text-sm">
            Choose a pattern to practice. Click any pattern to load it in the practice view.
          </p>
        </div>

        <DueForReviewBanner />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${activeCategory === cat.id
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pattern grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleSelect(pattern.id)}
              className="text-left bg-[#1a1d27] rounded-xl p-4 border border-gray-800
                         hover:border-gray-600 hover:bg-[#1e2130] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm group-hover:text-white transition-colors">
                  {pattern.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[pattern.category] ?? 'bg-gray-700 text-gray-400'}`}>
                  {pattern.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {pattern.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{pattern.defaultBpm} BPM</span>
                <span>{pattern.timeSignature.beats}/{pattern.timeSignature.noteValue}</span>
                <span>{pattern.subdivision}</span>
                <span>{pattern.tracks.length} tracks</span>
              </div>

              {/* Mini grid preview */}
              <div className="mt-3 flex flex-col gap-0.5">
                {pattern.tracks.slice(0, 3).map((track, ti) => (
                  <div key={ti} className="flex gap-px">
                    {track.steps.map((step, si) => (
                      <div
                        key={si}
                        className={`h-1.5 flex-1 rounded-sm ${
                          step.active ? 'bg-gray-500' : 'bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
            <div><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Space</kbd> Play / Pause</div>
            <div><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Esc</kbd> Stop</div>
            <div><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">&uarr;</kbd> BPM +1</div>
            <div><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Shift+&uarr;</kbd> BPM +10</div>
          </div>
        </div>
      </main>
    </div>
  );
}
