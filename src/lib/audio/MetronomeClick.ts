import { audioEngine } from './AudioEngine';

export function playMetronomeClick(
  time: number,
  isDownbeat: boolean,
  volume: number
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;
  const dest = audioEngine.destination;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(isDownbeat ? 1000 : 800, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + 0.05);
}
