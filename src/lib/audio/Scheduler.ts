import { audioEngine } from './AudioEngine';

export type StepCallback = (step: number, time: number) => void;

export class Scheduler {
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private nextStepTime = 0;
  private currentStep = 0;
  private onStep: StepCallback | null = null;
  private totalSteps = 8;
  private bpm = 120;
  private swing = 0;
  private subdivision: '8th' | '16th' | 'triplet' = '8th';
  private stepsPerBar = 8;
  private barsPlayed = 0;
  private stepsInCurrentBar = 0;

  // Callbacks for practice mode
  private onBarComplete: ((barCount: number) => void) | null = null;

  // External step listeners (used by live practice)
  private stepListeners: StepCallback[] = [];

  addStepListener(cb: StepCallback): () => void {
    this.stepListeners.push(cb);
    return () => {
      this.stepListeners = this.stepListeners.filter((l) => l !== cb);
    };
  }

  private readonly LOOKAHEAD_MS = 25;
  private readonly SCHEDULE_AHEAD_S = 0.1;

  start(
    bpm: number,
    totalSteps: number,
    subdivision: '8th' | '16th' | 'triplet',
    swing: number,
    onStep: StepCallback,
    onBarComplete?: (barCount: number) => void
  ): void {
    this.bpm = bpm;
    this.totalSteps = totalSteps;
    this.subdivision = subdivision;
    this.swing = swing;
    this.onStep = onStep;
    this.onBarComplete = onBarComplete ?? null;
    this.currentStep = 0;
    this.barsPlayed = 0;
    this.stepsInCurrentBar = 0;
    this.stepsPerBar = totalSteps;

    audioEngine.init();
    this.nextStepTime = audioEngine.currentTime + 0.05; // small lead time
    this.schedule();
  }

  stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.onStep = null;
    this.onBarComplete = null;
  }

  setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  setSwing(swing: number): void {
    this.swing = swing;
  }

  get step(): number {
    return this.currentStep;
  }

  get bars(): number {
    return this.barsPlayed;
  }

  private getStepDuration(): number {
    const beatsPerSecond = this.bpm / 60;
    switch (this.subdivision) {
      case '8th':
        return 1 / (beatsPerSecond * 2);
      case '16th':
        return 1 / (beatsPerSecond * 4);
      case 'triplet':
        return 1 / (beatsPerSecond * 3);
    }
  }

  private schedule(): void {
    const stepDuration = this.getStepDuration();

    while (this.nextStepTime < audioEngine.currentTime + this.SCHEDULE_AHEAD_S) {
      // Apply swing to even-numbered off-beat steps
      let swingOffset = 0;
      if (this.currentStep % 2 === 1 && this.swing > 0) {
        swingOffset = stepDuration * this.swing * 0.33;
      }

      const scheduledTime = this.nextStepTime + swingOffset;
      this.onStep?.(this.currentStep, scheduledTime);
      this.stepListeners.forEach((l) => l(this.currentStep, scheduledTime));

      // Track bar progress
      this.stepsInCurrentBar++;
      if (this.stepsInCurrentBar >= this.stepsPerBar) {
        this.stepsInCurrentBar = 0;
        this.barsPlayed++;
        this.onBarComplete?.(this.barsPlayed);
      }

      this.nextStepTime += stepDuration;
      this.currentStep = (this.currentStep + 1) % this.totalSteps;
    }

    this.timerId = setTimeout(() => this.schedule(), this.LOOKAHEAD_MS);
  }
}
