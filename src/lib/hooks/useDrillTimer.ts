'use client';

import { useEffect, useRef } from 'react';
import { useLivePracticeStore } from '../store/useLivePracticeStore';

export function useDrillTimer(onExpire: () => void): void {
  const isActive = useLivePracticeStore((s) => s.isActive);
  const drillStartedAt = useLivePracticeStore((s) => s.drillStartedAt);
  const drillDurationMs = useLivePracticeStore((s) => s.drillDurationMs);
  const updateCountdown = useLivePracticeStore((s) => s.updateDrillCountdown);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isActive || !drillStartedAt || !drillDurationMs) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - drillStartedAt;
      const remaining = drillDurationMs - elapsed;

      if (remaining <= 0) {
        updateCountdown(0);
        clearInterval(interval);
        onExpireRef.current();
      } else {
        updateCountdown(remaining);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isActive, drillStartedAt, drillDurationMs, updateCountdown]);
}
