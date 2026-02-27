import { BarAccuracy } from './types';

export interface TempoFloorResult {
  tempoFloor: number;
  recommendedBpm: number;
  floorAccuracy: number;
}

/**
 * Find the BPM where accuracy drops below threshold.
 * Groups consecutive bars by BPM, averages accuracy per group,
 * and returns the first group that falls below the threshold.
 */
export function findTempoFloor(
  barHistory: BarAccuracy[],
  accuracyThreshold: number = 70
): TempoFloorResult | null {
  const barsWithBpm = barHistory.filter((b) => b.bpm != null);
  if (barsWithBpm.length < 4) return null;

  // Group consecutive bars by BPM
  const groups: { bpm: number; accuracies: number[] }[] = [];
  let currentGroup: { bpm: number; accuracies: number[] } | null = null;

  for (const bar of barsWithBpm) {
    if (!currentGroup || currentGroup.bpm !== bar.bpm!) {
      currentGroup = { bpm: bar.bpm!, accuracies: [] };
      groups.push(currentGroup);
    }
    currentGroup.accuracies.push(bar.accuracy);
  }

  const bpmAccuracies = groups.map((g) => ({
    bpm: g.bpm,
    avgAccuracy: g.accuracies.reduce((a, b) => a + b, 0) / g.accuracies.length,
  }));

  // Find first group below threshold
  for (const group of bpmAccuracies) {
    if (group.avgAccuracy < accuracyThreshold) {
      return {
        tempoFloor: group.bpm,
        recommendedBpm: Math.max(40, group.bpm - 5),
        floorAccuracy: Math.round(group.avgAccuracy),
      };
    }
  }

  // Fall back to 80% threshold
  for (const group of bpmAccuracies) {
    if (group.avgAccuracy < 80) {
      return {
        tempoFloor: group.bpm,
        recommendedBpm: Math.max(40, group.bpm - 5),
        floorAccuracy: Math.round(group.avgAccuracy),
      };
    }
  }

  return null;
}
