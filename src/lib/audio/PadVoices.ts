import { InstrumentId } from '../patterns/types';
import { PadVoiceId, CHOKE_GROUPS, ORIGINAL_INSTRUMENTS } from '../drumpad/types';
import { audioEngine } from './AudioEngine';
import { playInstrument } from './DrumSynth';

// Track active gain nodes for chokeable voices
const activeChokeVoices = new Map<string, GainNode>();

function handleChokeGroup(voiceId: PadVoiceId, time: number): void {
  for (const group of CHOKE_GROUPS) {
    const idx = group.indexOf(voiceId);
    if (idx === -1) continue;

    for (const otherId of group) {
      if (otherId === voiceId) continue;
      const activeGain = activeChokeVoices.get(otherId);
      if (activeGain) {
        activeGain.gain.cancelScheduledValues(time);
        activeGain.gain.setValueAtTime(activeGain.gain.value, time);
        activeGain.gain.linearRampToValueAtTime(0, time + 0.005);
        activeChokeVoices.delete(otherId);
      }
    }
  }
}

// Check if voice is in any choke group
function isChokeable(voiceId: PadVoiceId): boolean {
  return CHOKE_GROUPS.some((group) => group.includes(voiceId));
}

export function playPadVoice(
  voiceId: PadVoiceId,
  time: number,
  velocity: number,
  volume: number
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;

  handleChokeGroup(voiceId, time);

  // For original instruments, use the existing synth but wrap chokeable ones
  if (ORIGINAL_INSTRUMENTS.has(voiceId)) {
    if (isChokeable(voiceId)) {
      // Wrap in a gain node we can choke
      const chokeGain = ctx.createGain();
      chokeGain.connect(audioEngine.destination);
      activeChokeVoices.set(voiceId, chokeGain);
      playInstrumentToNode(voiceId as InstrumentId, time, velocity, volume, chokeGain);
    } else {
      playInstrument(voiceId as InstrumentId, time, velocity, volume);
    }
    return;
  }

  const dest = audioEngine.destination;
  const vol = velocity * volume;

  switch (voiceId) {
    case 'kick-deep':
      playKickDeep(ctx, dest, time, vol);
      break;
    case 'kick-sub':
      playKickSub(ctx, dest, time, vol);
      break;
    case 'snare-clap':
      playClap(ctx, dest, time, vol);
      break;
    case 'snare-rimshot':
      playRimshot(ctx, dest, time, vol);
      break;
    case 'snare-sidestick':
      playSidestick(ctx, dest, time, vol);
      break;
    case 'snare-cross':
      playCrossStick(ctx, dest, time, vol);
      break;
    case 'percussion':
      playPercussion(ctx, dest, time, vol);
      break;
  }
}

// Play an original instrument routed to a custom destination node (for choke support)
function playInstrumentToNode(
  instrumentId: InstrumentId,
  time: number,
  velocity: number,
  volume: number,
  dest: AudioNode
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;
  const vol = velocity * volume;

  switch (instrumentId) {
    case 'hihat-closed':
      playHiHatToNode(ctx, dest, time, vol, false);
      break;
    case 'hihat-open':
      playHiHatToNode(ctx, dest, time, vol, true);
      break;
    default:
      // Fallback - shouldn't reach here for current choke groups
      playInstrument(instrumentId, time, velocity, volume);
      break;
  }
}

// Hi-hat synthesis routed to a custom node (mirrors DrumSynth's playHiHat)
function playHiHatToNode(
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

// --- Variant voices ---

function playKickDeep(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(100, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.6);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(50, time);
  osc2.frequency.exponentialRampToValueAtTime(0.01, time + 0.6);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(velocity * 0.8, time);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

  osc.connect(gain).connect(destination);
  osc2.connect(gain2).connect(destination);

  osc.start(time);
  osc.stop(time + 0.6);
  osc2.start(time);
  osc2.stop(time + 0.6);
}

function playKickSub(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(60, time);
  osc.frequency.exponentialRampToValueAtTime(30, time + 0.8);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity * 0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.8);
}

function playClap(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const noiseBuffer = audioEngine.noiseBuffer;
  if (!noiseBuffer) return;

  // Three staggered noise bursts
  const offsets = [0, 0.015, 0.03];
  offsets.forEach((offset) => {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time + offset);
    filter.Q.setValueAtTime(0.7, time + offset);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.6, time + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, time + offset + 0.15);

    noise.connect(filter).connect(gain).connect(destination);
    noise.start(time + offset);
    noise.stop(time + offset + 0.15);
  });
}

function playRimshot(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  // Sharp triangle body
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(250, time);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(velocity * 0.6, time);
  oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.connect(oscGain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.05);

  // Short noise burst
  const noiseBuffer = audioEngine.noiseBuffer;
  if (noiseBuffer) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter).connect(noiseGain).connect(destination);
    noise.start(time);
    noise.stop(time + 0.04);
  }
}

function playSidestick(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity * 0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.03);
}

function playCrossStick(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const noiseBuffer = audioEngine.noiseBuffer;
  if (!noiseBuffer) return;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1500, time);
  filter.Q.setValueAtTime(3, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity * 0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  noise.connect(filter).connect(gain).connect(destination);
  noise.start(time);
  noise.stop(time + 0.1);
}

function playPercussion(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  velocity: number
): void {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(350, time);
  osc.frequency.exponentialRampToValueAtTime(175, time + 0.08);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(velocity * 0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.08);
}
