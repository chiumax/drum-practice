import { rockPatterns } from './rock';
import { funkPatterns } from './funk';
import { latinPatterns } from './latin';
import { rudimentPatterns } from './rudiments';
import { DrumPattern, PatternCategory } from './types';

export const allPatterns: DrumPattern[] = [
  ...rockPatterns,
  ...funkPatterns,
  ...latinPatterns,
  ...rudimentPatterns,
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
];
