import { InstrumentId } from '../patterns/types';
import {
  ExpectedBeat,
  TapEvent,
  TimingGrade,
  TIMING_THRESHOLDS,
} from './types';

export class TapMatcher {
  private expectedBeats: ExpectedBeat[] = [];
  private taps: TapEvent[] = [];

  reset(): void {
    this.expectedBeats = [];
    this.taps = [];
  }

  addExpectedBeat(step: number, time: number, instrumentId: InstrumentId): void {
    this.expectedBeats.push({ step, time, instrumentId, matched: false });
  }

  processTap(tapTime: number, instrumentId: InstrumentId): TapEvent {
    let bestBeat: ExpectedBeat | null = null;
    let bestAbsOffset = Infinity;

    for (const beat of this.expectedBeats) {
      if (beat.matched || beat.instrumentId !== instrumentId) continue;
      const absOffset = Math.abs(tapTime - beat.time);
      if (absOffset < bestAbsOffset) {
        bestAbsOffset = absOffset;
        bestBeat = beat;
      }
    }

    let grade: TimingGrade;
    let matchedStep: number | null = null;
    let offset = 0;

    if (bestBeat && bestAbsOffset <= TIMING_THRESHOLDS.MAX_WINDOW) {
      bestBeat.matched = true;
      matchedStep = bestBeat.step;
      offset = tapTime - bestBeat.time;

      if (bestAbsOffset <= TIMING_THRESHOLDS.PERFECT) grade = 'perfect';
      else if (bestAbsOffset <= TIMING_THRESHOLDS.GREAT) grade = 'great';
      else if (bestAbsOffset <= TIMING_THRESHOLDS.GOOD) grade = 'good';
      else grade = offset < 0 ? 'early' : 'late';
    } else {
      // Stray tap — no matching beat nearby
      grade = 'early';
      offset = 0;
    }

    const tap: TapEvent = {
      timestamp: tapTime,
      instrumentId,
      matchedStep,
      offset,
      grade,
    };
    this.taps.push(tap);
    return tap;
  }

  sweepMisses(currentTime: number): ExpectedBeat[] {
    const missThreshold = currentTime - TIMING_THRESHOLDS.MAX_WINDOW;
    const misses: ExpectedBeat[] = [];

    this.expectedBeats = this.expectedBeats.filter((beat) => {
      if (!beat.matched && beat.time < missThreshold) {
        misses.push(beat);
        return false;
      }
      if (beat.matched && beat.time < missThreshold) {
        return false;
      }
      return true;
    });

    return misses;
  }

  getTaps(): TapEvent[] {
    return this.taps;
  }
}
