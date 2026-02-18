'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTransportStore } from '@/lib/store/useTransportStore';

export function useStopOnNavigate() {
  const pathname = usePathname();
  const stop = useTransportStore((s) => s.stop);
  const playState = useTransportStore((s) => s.playState);

  // Stop playback on route change
  useEffect(() => {
    if (playState === 'playing') {
      stop();
    }
    // Only trigger on pathname changes, not on play/stop state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Stop playback when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && useTransportStore.getState().playState === 'playing') {
        useTransportStore.getState().stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}
