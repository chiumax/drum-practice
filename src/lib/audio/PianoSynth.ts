import { audioEngine } from './AudioEngine';
import { ALL_NOTES } from '../sight-reading/notes';

/**
 * Play a piano-like tone using layered sine oscillators.
 * Layers: fundamental + 2nd harmonic (0.4x) + 3rd harmonic (0.15x)
 * with an exponential decay envelope.
 */
export function playPianoNote(
  noteIndex: number,
  velocity: number = 0.6
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;

  const note = ALL_NOTES[noteIndex];
  if (!note) return;

  const dest = audioEngine.destination;
  const time = ctx.currentTime;
  const freq = note.frequency;
  const duration = 1.5;

  // Harmonics: [multiplier, amplitude ratio]
  const harmonics: [number, number][] = [
    [1, 1.0],    // fundamental
    [2, 0.4],    // 2nd harmonic
    [3, 0.15],   // 3rd harmonic
  ];

  // Shared gain envelope for all harmonics
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(velocity * 0.5, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
  gainNode.connect(dest);

  for (const [mult, amp] of harmonics) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * mult, time);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(amp, time);

    osc.connect(harmGain).connect(gainNode);
    osc.start(time);
    osc.stop(time + duration);
  }
}

/**
 * Play a short error buzz — filtered noise burst to indicate wrong note.
 */
export function playErrorBuzz(): void {
  const ctx = audioEngine.context;
  if (!ctx) return;

  const noiseBuffer = audioEngine.noiseBuffer;
  if (!noiseBuffer) return;

  const dest = audioEngine.destination;
  const time = ctx.currentTime;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, time);
  filter.Q.setValueAtTime(2, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

  source.connect(filter).connect(gain).connect(dest);
  source.start(time);
  source.stop(time + 0.12);
}
