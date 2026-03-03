import { audioEngine } from '../audio/AudioEngine';
import { SoundPack } from './types';

// Cache of decoded AudioBuffers keyed by URL path
const bufferCache = new Map<string, AudioBuffer>();

// Currently playing sources keyed by pad index
const activeSources = new Map<number, { source: AudioBufferSourceNode; gain: GainNode }>();

// Loading state
let currentPackId: string | null = null;
let loadingPromise: Promise<void> | null = null;

function getSampleUrl(packFilename: string, chain: number, sampleId: string): string {
  return `/sounds/${packFilename}/chain${chain + 1}/${sampleId}.mp3`;
}

async function loadBuffer(url: string): Promise<AudioBuffer | null> {
  if (bufferCache.has(url)) return bufferCache.get(url)!;

  const ctx = audioEngine.context;
  if (!ctx) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCache.set(url, audioBuffer);
    return audioBuffer;
  } catch {
    return null;
  }
}

export async function loadPack(pack: SoundPack): Promise<void> {
  if (currentPackId === pack.id && !loadingPromise) return;

  audioEngine.init();
  currentPackId = pack.id;

  // Collect all unique sample URLs across all chains
  const urls = new Set<string>();
  for (let chain = 0; chain < 4; chain++) {
    for (const sampleId of pack.mappings[chain]) {
      if (sampleId) {
        urls.add(getSampleUrl(pack.filename, chain, sampleId));
      }
    }
  }

  // Load all in parallel
  loadingPromise = Promise.all(
    Array.from(urls).map((url) => loadBuffer(url))
  ).then(() => {
    loadingPromise = null;
  });

  return loadingPromise;
}

export function getLoadingState(): { isLoading: boolean; packId: string | null } {
  return { isLoading: loadingPromise !== null, packId: currentPackId };
}

export function playSample(
  pack: SoundPack,
  chain: number,
  padIndex: number,
): void {
  const ctx = audioEngine.context;
  if (!ctx) return;

  const sampleId = pack.mappings[chain][padIndex];
  if (!sampleId) return;

  const url = getSampleUrl(pack.filename, chain, sampleId);
  const buffer = bufferCache.get(url);
  if (!buffer) return;

  // Stop currently playing sound at this pad
  stopPad(padIndex);

  // Handle linked areas - stop other pads in the same group
  const linkedGroups = pack.linkedAreas[chain];
  for (const group of linkedGroups) {
    if (group.includes(padIndex)) {
      for (const otherPad of group) {
        if (otherPad !== padIndex) {
          stopPad(otherPad);
        }
      }
    }
  }

  // Create and play source
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.8, ctx.currentTime);

  source.connect(gain).connect(audioEngine.destination);
  source.start(ctx.currentTime);

  activeSources.set(padIndex, { source, gain });

  source.onended = () => {
    const current = activeSources.get(padIndex);
    if (current?.source === source) {
      activeSources.delete(padIndex);
    }
  };
}

export function stopPad(padIndex: number): void {
  const active = activeSources.get(padIndex);
  if (!active) return;

  const ctx = audioEngine.context;
  if (ctx) {
    active.gain.gain.cancelScheduledValues(ctx.currentTime);
    active.gain.gain.setValueAtTime(active.gain.gain.value, ctx.currentTime);
    active.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.01);
  }

  try {
    active.source.stop(ctx ? ctx.currentTime + 0.015 : 0);
  } catch {
    // Already stopped
  }

  activeSources.delete(padIndex);
}

export function isHoldToPlay(pack: SoundPack, chain: number, padIndex: number): boolean {
  return pack.holdToPlay[chain].includes(padIndex);
}
