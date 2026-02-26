'use client';

import { Header } from '@/components/Header';
import { OverallStatsRow } from '@/components/progress/OverallStatsRow';
import { DueForReviewSection } from '@/components/progress/DueForReviewSection';
import { PracticeCalendar } from '@/components/progress/PracticeCalendar';
import { PatternProgressList } from '@/components/progress/PatternProgressList';

export default function ProgressPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Progress</h1>
          <p className="text-gray-400 text-sm">
            Track your practice history and see which patterns need review.
          </p>
        </div>

        <div className="space-y-6">
          <OverallStatsRow />
          <DueForReviewSection />
          <PracticeCalendar />
          <PatternProgressList />
        </div>
      </main>
    </div>
  );
}
