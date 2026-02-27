import { ALL_NOTES } from '../sight-reading/notes';

/**
 * Maps a frequency (Hz) to the nearest note index in ALL_NOTES.
 * Returns null if the frequency is more than 50 cents off from any note.
 */
export function frequencyToNoteIndex(freq: number): number | null {
  if (freq <= 0) return null;

  let bestIndex = -1;
  let bestCents = Infinity;

  for (const note of ALL_NOTES) {
    const cents = Math.abs(1200 * Math.log2(freq / note.frequency));
    if (cents < bestCents) {
      bestCents = cents;
      bestIndex = note.index;
    }
  }

  return bestCents <= 50 ? bestIndex : null;
}

/**
 * Real-time pitch detection using Web Audio API + autocorrelation.
 * Designed for monophonic piano note detection.
 */
export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private buffer: Float32Array<ArrayBuffer> = new Float32Array(0);
  private animFrameId: number | null = null;
  private onPitch: ((noteIndex: number, frequency: number) => void) | null = null;
  private lastNoteIndex: number | null = null;
  private stableCount = 0;
  private readonly STABLE_THRESHOLD = 4; // ~66ms at 60fps

  async start(onPitch: (noteIndex: number, frequency: number) => void): Promise<void> {
    this.onPitch = onPitch;

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.buffer = new Float32Array(this.analyser.fftSize);

    // Low-pass filter to improve fundamental detection
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    this.source.connect(filter);
    filter.connect(this.analyser);

    this.detect();
  }

  stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.onPitch = null;
    this.lastNoteIndex = null;
    this.stableCount = 0;
  }

  private detect = (): void => {
    this.animFrameId = requestAnimationFrame(this.detect);

    if (!this.analyser) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    // RMS gate — ignore quiet signals
    let rms = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      rms += this.buffer[i] * this.buffer[i];
    }
    rms = Math.sqrt(rms / this.buffer.length);
    if (rms < 0.01) {
      this.lastNoteIndex = null;
      this.stableCount = 0;
      return;
    }

    const freq = this.autoCorrelate();
    if (freq === -1) {
      this.lastNoteIndex = null;
      this.stableCount = 0;
      return;
    }

    const noteIndex = frequencyToNoteIndex(freq);
    if (noteIndex === null) {
      this.lastNoteIndex = null;
      this.stableCount = 0;
      return;
    }

    // Debounce: require stable pitch for a few frames
    if (noteIndex === this.lastNoteIndex) {
      this.stableCount++;
    } else {
      this.lastNoteIndex = noteIndex;
      this.stableCount = 1;
    }

    if (this.stableCount === this.STABLE_THRESHOLD && this.onPitch) {
      this.onPitch(noteIndex, freq);
    }
  };

  /**
   * Autocorrelation pitch detection.
   * Returns detected frequency in Hz, or -1 if no clear pitch.
   */
  private autoCorrelate(): number {
    const buf = this.buffer;
    const sampleRate = this.audioContext?.sampleRate ?? 44100;
    const SIZE = buf.length;

    // Find the first zero crossing (trim silence from ends)
    let r1 = 0;
    let r2 = SIZE - 1;
    const threshold = 0.2;

    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmedBuf = buf.slice(r1, r2);
    const trimmedSize = trimmedBuf.length;

    if (trimmedSize < 2) return -1;

    // Autocorrelation
    const c = new Float32Array(trimmedSize);
    for (let i = 0; i < trimmedSize; i++) {
      for (let j = 0; j < trimmedSize - i; j++) {
        c[i] += trimmedBuf[j] * trimmedBuf[j + i];
      }
    }

    // Find first dip
    let d = 0;
    while (d < trimmedSize && c[d] > c[d + 1]) {
      d++;
    }

    // Find peak after first dip
    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < trimmedSize; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }

    if (maxPos === -1 || maxVal < 0.01) return -1;

    // Parabolic interpolation for better precision
    const y1 = maxPos > 0 ? c[maxPos - 1] : c[maxPos];
    const y2 = c[maxPos];
    const y3 = maxPos < trimmedSize - 1 ? c[maxPos + 1] : c[maxPos];
    const shift = (y3 - y1) / (2 * (2 * y2 - y1 - y3));
    const refinedPos = maxPos + (isFinite(shift) ? shift : 0);

    return sampleRate / refinedPos;
  }
}
