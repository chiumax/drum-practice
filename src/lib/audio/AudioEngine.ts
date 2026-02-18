class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private _noiseBuffer: AudioBuffer | null = null;

  init(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -12;
      this.compressor.knee.value = 10;
      this.compressor.ratio.value = 4;
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Pre-generate noise buffer (2 seconds)
      const bufferSize = this.ctx.sampleRate * 2;
      this._noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this._noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  get currentTime(): number {
    return this.ctx?.currentTime ?? 0;
  }

  get destination(): GainNode {
    return this.masterGain!;
  }

  get noiseBuffer(): AudioBuffer | null {
    return this._noiseBuffer;
  }

  setMasterVolume(value: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(value, this.ctx.currentTime);
    }
  }
}

export const audioEngine = new AudioEngine();
