'use client';

import { useStopOnNavigate } from '@/lib/hooks/useStopOnNavigate';

export function PlaybackGuard() {
  useStopOnNavigate();
  return null;
}
