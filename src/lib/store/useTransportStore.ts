import { create } from 'zustand';
import { PlayState, Track } from '../patterns/types';
import { Scheduler } from '../audio/Scheduler';
import { playInstrument } from '../audio/DrumSynth';
import { playMetronomeClick } from '../audio/MetronomeClick';
import { audioEngine } from '../audio/AudioEngine';

export const scheduler = new Scheduler();

// Lazy accessors to avoid circular imports
function getPatternState() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePatternStore } = require('./usePatternStore');
  return usePatternStore.getState() as {
    currentPattern: {
      tracks: Track[];
      totalSteps: number;
      subdivision: '8th' | '16th' | 'triplet';
    };
  };
}

function getPracticeState() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePracticeStore } = require('./usePracticeStore');
  return usePracticeStore as {
    getState: () => {
      mode: string;
      tempoRampConfig: { incrementBpm: number; endBpm: number; barsPerIncrement: number };
    };
    setState: (state: Record<string, unknown>) => void;
  };
}

interface TransportStore {
  playState: PlayState;
  bpm: number;
  currentStep: number;
  swing: number;

  play: () => void;
  pause: () => void;
  stop: () => void;
  setBpm: (bpm: number) => void;
  setCurrentStep: (step: number) => void;
  setSwing: (swing: number) => void;
}

export const useTransportStore = create<TransportStore>((set, get) => ({
  playState: 'stopped',
  bpm: 100,
  currentStep: -1,
  swing: 0,

  play: () => {
    const { currentPattern: pattern } = getPatternState();
    const { bpm, swing } = get();

    audioEngine.init();

    const onStep = (step: number, time: number) => {
      // Re-read pattern each step to pick up live edits
      const { currentPattern: livePattern } = getPatternState();

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useSettingsStore } = require('./useSettingsStore');
      const settings = useSettingsStore.getState();

      if (!settings.mutePatternPlayback) {
        livePattern.tracks.forEach((track: Track) => {
          if (track.muted) return;
          const s = track.steps[step];
          if (s && s.active) {
            playInstrument(track.instrumentId, time, s.velocity, track.volume);
          }
        });
      }

      // Metronome click
      const metronomeMode = settings.metronomeMode;
      if (metronomeMode !== 'off') {
        const sub = livePattern.subdivision;
        const stepsPerBeat = sub === '8th' ? 2 : sub === '16th' ? 4 : 3;
        if (step % stepsPerBeat === 0) {
          const beatInBar = step / stepsPerBeat;
          let shouldClick = false;
          let isDownbeat = beatInBar === 0;
          switch (metronomeMode) {
            case 'every-beat':
              shouldClick = true;
              break;
            case '2-and-4':
              shouldClick = beatInBar === 1 || beatInBar === 3;
              isDownbeat = false;
              break;
            case 'one-per-bar':
              shouldClick = beatInBar === 0;
              break;
          }
          if (shouldClick) {
            playMetronomeClick(time, isDownbeat, settings.metronomeVolume);
          }
        }
      }

      // Schedule UI update synced to audio time
      const delayMs = Math.max(0, (time - audioEngine.currentTime) * 1000);
      setTimeout(() => {
        set({ currentStep: step });
      }, delayMs);
    };

    const practiceStore = getPracticeState();
    const practiceState = practiceStore.getState();
    const onBarComplete = practiceState.mode === 'tempo-ramp'
      ? (barCount: number) => {
          const ps = practiceStore.getState();
          if (ps.mode === 'tempo-ramp' && ps.tempoRampConfig) {
            const config = ps.tempoRampConfig;
            if (barCount > 0 && barCount % config.barsPerIncrement === 0) {
              const currentBpm = get().bpm;
              const newBpm = Math.min(currentBpm + config.incrementBpm, config.endBpm);
              if (newBpm !== currentBpm) {
                set({ bpm: newBpm });
                scheduler.setBpm(newBpm);
                practiceStore.setState({ currentBpm: newBpm });
              }
            }
          }
          practiceStore.setState({ barsPlayed: barCount });
        }
      : undefined;

    scheduler.start(bpm, pattern.totalSteps, pattern.subdivision, swing, onStep, onBarComplete);
    set({ playState: 'playing' });
  },

  pause: () => {
    scheduler.stop();
    set({ playState: 'paused' });
  },

  stop: () => {
    scheduler.stop();
    set({ playState: 'stopped', currentStep: -1 });
  },

  setBpm: (bpm: number) => {
    const clamped = Math.max(40, Math.min(240, bpm));
    set({ bpm: clamped });
    scheduler.setBpm(clamped);
  },

  setCurrentStep: (step: number) => set({ currentStep: step }),

  setSwing: (swing: number) => {
    set({ swing });
    scheduler.setSwing(swing);
  },
}));
