import { InstrumentId } from '../patterns/types';
import { audioEngine } from './AudioEngine';

export function playInstrument(
  instrumentId: InstrumentId,
  time: number,
  velocity: number,
  volume: number
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;

  const dest = audioEngine.destination;
  const vol = velocity * volume;

  switch (instrumentId) {
    case 'kick':
      playKick(ctx, dest, time, vol);
      break;
    case 'snare':
      playSnare(ctx, dest, time, vol);
      break;
    case 'hihat-closed':
      playHiHat(ctx, dest, time, vol, false);
      break;
    case 'hihat-open':
      playHiHat(ctx, dest, time, vol, true);
      break;
    case 'tom-high':
      playTom(ctx, dest, time, vol, 'high');
      break;
    case 'tom-mid':
      playTom(ctx, dest, time, vol, 'mid');
      break;
    case 'tom-low':
      playTom(ctx, dest, time, vol, 'low');
      break;
    case 'crash':
      playCymbal(ctx, dest, time, vol, 'crash');
      break;
    case 'ride':
      playCymbal(ctx, dest, time, vol, 'ride');
      break;
  }
}

function playKick(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  // Triangle oscillator with pitch sweep for the "click"
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(velocity, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

  // Sine "body" at lower frequency
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(80, time);
  osc2.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

  const gainNode2 = ctx.createGain();
  gainNode2.gain.setValueAtTime(velocity * 0.7, time);
  gainNode2.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

  osc.connect(gainNode).connect(destination);
  osc2.connect(gainNode2).connect(destination);

  osc.start(time);
  osc.stop(time + 0.5);
  osc2.start(time);
  osc2.stop(time + 0.5);
}

function playSnare(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  // Noise component (snare wires)
  const noiseBuffer = audioEngine.noiseBuffer;
  if (noiseBuffer) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1000, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.7, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    noise.connect(noiseFilter).connect(noiseGain).connect(destination);
    noise.start(time);
    noise.stop(time + 0.2);
  }

  // Body tone
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(185, time);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(velocity * 0.5, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  osc.connect(oscGain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.1);
}

function playHiHat(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number,
  open: boolean
): void {
  const fundamental = 40;
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
  const decayTime = open ? 0.3 : 0.08;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(10000, time);

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(7000, time);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(velocity * 0.3, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

  bandpass.connect(highpass).connect(gainNode).connect(destination);

  ratios.forEach((ratio) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(fundamental * ratio, time);
    osc.connect(bandpass);
    osc.start(time);
    osc.stop(time + decayTime);
  });
}

function playTom(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number,
  pitch: 'high' | 'mid' | 'low'
): void {
  const freqMap = { high: 200, mid: 150, low: 100 };
  const freq = freqMap[pitch];

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playCymbal(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number,
  type: 'crash' | 'ride'
): void {
  const decayTime = type === 'crash' ? 1.5 : 0.6;
  const filterFreq = type === 'crash' ? 5000 : 8000;

  const noiseBuffer = audioEngine.noiseBuffer;
  if (!noiseBuffer) return;

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(filterFreq, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity * 0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

  source.connect(highpass).connect(gain).connect(destination);
  source.start(time);
  source.stop(time + decayTime);
}
