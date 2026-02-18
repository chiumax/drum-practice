import { Step, DrumPattern } from './types';

export function boolsToSteps(bools: (0 | 1)[], defaultVelocity = 0.8): Step[] {
  return bools.map((b) => ({
    active: b === 1,
    velocity: defaultVelocity,
    accent: false,
  }));
}

export function accentedSteps(
  bools: (0 | 1)[],
  accents: (0 | 1)[],
  baseVelocity = 0.6,
  accentVelocity = 1.0
): Step[] {
  return bools.map((b, i) => ({
    active: b === 1,
    velocity: accents[i] ? accentVelocity : baseVelocity,
    accent: accents[i] === 1,
  }));
}

export function clonePattern(pattern: DrumPattern): DrumPattern {
  return JSON.parse(JSON.stringify(pattern));
}
