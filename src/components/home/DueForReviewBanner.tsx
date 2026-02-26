'use client';

import Link from 'next/link';
import { getDuePatterns } from '@/lib/store/usePracticeHistoryStore';

export function DueForReviewBanner() {
  const dueCount = getDuePatterns().length;

  if (dueCount === 0) return null;

  return (
    <Link
      href="/progress"
      className="block bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6
                 hover:bg-orange-500/15 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-orange-400">
            {dueCount} pattern{dueCount !== 1 ? 's' : ''} due for review
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            Based on your practice history and spaced repetition schedule
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" className="text-orange-400">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </Link>
  );
}
