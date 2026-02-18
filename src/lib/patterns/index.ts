import { rockPatterns } from './rock';
import { funkPatterns } from './funk';
import { latinPatterns } from './latin';
import { rudimentPatterns } from './rudiments';
import { jazzPatterns } from './jazz';
import { electronicPatterns } from './electronic';
import { polyrhythmPatterns } from './polyrhythms';
import { DrumPattern, PatternCategory } from './types';

export const allPatterns: DrumPattern[] = [
  ...rockPatterns,
  ...funkPatterns,
  ...latinPatterns,
  ...rudimentPatterns,
  ...jazzPatterns,
  ...electronicPatterns,
  ...polyrhythmPatterns,
];

export function getPatternsByCategory(category: PatternCategory): DrumPattern[] {
  return allPatterns.filter((p) => p.category === category);
}

export function getPatternById(id: string): DrumPattern | undefined {
  return allPatterns.find((p) => p.id === id);
}

export const categories: { id: PatternCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'rock', label: 'Rock' },
  { id: 'funk', label: 'Funk' },
  { id: 'latin', label: 'Latin' },
  { id: 'world', label: 'World' },
  { id: 'rudiment', label: 'Rudiments' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'polyrhythm', label: 'Polyrhythm' },
];
