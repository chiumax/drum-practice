import { SessionStats, DetailedTapRecord } from './types';
import { InstrumentId } from '../patterns/types';

export interface FeedbackMessage {
  type: 'positive' | 'improvement' | 'suggestion';
  text: string;
  priority: number;
}

export function analyzeFeedback(
  stats: SessionStats,
  bpm: number,
  totalStepsPerBar: number
): FeedbackMessage[] {
  const messages: FeedbackMessage[] = [];
  const taps = stats.detailedTaps ?? [];

  if (taps.length < 4) return messages;

  const accuracy = stats.totalExpected > 0
    ? (stats.totalHits / stats.totalExpected) * 100
    : 0;

  // Overall accuracy suggestions
  if (accuracy >= 90) {
    messages.push({
      type: 'positive',
      text: `Clean at ${bpm} BPM \u2014 ready to move up 5.`,
      priority: 10,
    });
  } else if (accuracy < 60) {
    const suggestedBpm = Math.max(40, bpm - 15);
    messages.push({
      type: 'suggestion',
      text: `Try dropping to ${suggestedBpm} BPM for cleaner practice.`,
      priority: 10,
    });
  }

  analyzePerStepTiming(taps, totalStepsPerBar, messages);
  analyzePerInstrumentTiming(taps, messages);
  analyzeBarHalves(taps, totalStepsPerBar, messages);

  messages.sort((a, b) => b.priority - a.priority);
  return messages.slice(0, 3);
}

function analyzePerStepTiming(
  taps: DetailedTapRecord[],
  totalStepsPerBar: number,
  messages: FeedbackMessage[]
): void {
  const byStep = new Map<number, number[]>();
  for (const tap of taps) {
    const existing = byStep.get(tap.step) ?? [];
    existing.push(tap.offset);
    byStep.set(tap.step, existing);
  }

  const stepsPerBeat = Math.max(1, totalStepsPerBar / 4);

  for (const [step, offsets] of byStep) {
    if (offsets.length < 3) continue;
    const avgMs = (offsets.reduce((a, b) => a + b, 0) / offsets.length) * 1000;
    const beatNum = Math.floor(step / stepsPerBeat) + 1;

    if (avgMs > 25) {
      messages.push({
        type: 'improvement',
        text: `You're consistently late on beat ${beatNum}.`,
        priority: 7,
      });
    } else if (avgMs < -25) {
      messages.push({
        type: 'improvement',
        text: `You're rushing beat ${beatNum}.`,
        priority: 7,
      });
    }
  }
}

function analyzePerInstrumentTiming(
  taps: DetailedTapRecord[],
  messages: FeedbackMessage[]
): void {
  const byInstrument = new Map<InstrumentId, number[]>();
  for (const tap of taps) {
    const existing = byInstrument.get(tap.instrumentId) ?? [];
    existing.push(tap.offset);
    byInstrument.set(tap.instrumentId, existing);
  }

  const variances: { instrument: InstrumentId; variance: number }[] = [];
  for (const [instrument, offsets] of byInstrument) {
    if (offsets.length < 3) continue;
    const mean = offsets.reduce((a, b) => a + b, 0) / offsets.length;
    const variance = offsets.reduce((sum, o) => sum + (o - mean) ** 2, 0) / offsets.length;
    variances.push({ instrument, variance });
  }

  if (variances.length >= 2) {
    variances.sort((a, b) => b.variance - a.variance);
    const worst = variances[0];
    const best = variances[variances.length - 1];
    if (worst.variance > best.variance * 2) {
      messages.push({
        type: 'improvement',
        text: `Your ${instrumentLabel(worst.instrument)} timing is the most inconsistent.`,
        priority: 6,
      });
    }
  }
}

function analyzeBarHalves(
  taps: DetailedTapRecord[],
  totalStepsPerBar: number,
  messages: FeedbackMessage[]
): void {
  const halfwayStep = totalStepsPerBar / 2;
  const firstHalf: number[] = [];
  const secondHalf: number[] = [];

  for (const tap of taps) {
    if (tap.step < halfwayStep) {
      firstHalf.push(tap.offset);
    } else {
      secondHalf.push(tap.offset);
    }
  }

  if (firstHalf.length < 3 || secondHalf.length < 3) return;

  const avgFirst = (firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length) * 1000;
  const avgSecond = (secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length) * 1000;

  if (avgSecond < avgFirst - 15 && avgSecond < -10) {
    messages.push({
      type: 'improvement',
      text: 'Rushing during the second half of each bar.',
      priority: 8,
    });
  }
  if (avgSecond > avgFirst + 15 && avgSecond > 10) {
    messages.push({
      type: 'improvement',
      text: 'Dragging during the second half of each bar.',
      priority: 8,
    });
  }
}

function instrumentLabel(id: InstrumentId): string {
  const labels: Record<InstrumentId, string> = {
    kick: 'kick',
    snare: 'snare',
    'hihat-closed': 'hi-hat',
    'hihat-open': 'open hi-hat',
    'tom-high': 'high tom',
    'tom-mid': 'mid tom',
    'tom-low': 'floor tom',
    crash: 'crash',
    ride: 'ride',
  };
  return labels[id] ?? id;
}
