import { create } from 'zustand';
import { PadVoiceId, RecordedHit, KITS } from '../drumpad/types';
import { Routine } from '../drumpad/routines';
import { audioEngine } from '../audio/AudioEngine';
import { playPadVoice } from '../audio/PadVoices';

interface DrumpadState {
  activePads: Set<PadVoiceId>;
  currentKit: number;
  activeRoutineName: string | null;

  // Recording
  isRecording: boolean;
  recordingStartTime: number | null;
  recordedHits: RecordedHit[];

  // Playback
  isPlaying: boolean;
  isLooping: boolean;
  playbackSpeed: number; // 1.0 = original, 0.5 = half, 2.0 = double
  playbackTimerIds: number[];

  // Actions
  triggerPad: (padId: PadVoiceId, velocity?: number) => void;
  releasePad: (padId: PadVoiceId) => void;
  setKit: (index: number) => void;
  loadRoutine: (routine: Routine) => void;

  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;

  startPlayback: () => void;
  stopPlayback: () => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useDrumpadStore = create<DrumpadState>()((set, get) => ({
  activePads: new Set<PadVoiceId>(),
  currentKit: 0,
  activeRoutineName: null,

  isRecording: false,
  recordingStartTime: null,
  recordedHits: [],

  isPlaying: false,
  isLooping: true,
  playbackSpeed: 1.0,
  playbackTimerIds: [],

  triggerPad: (padId: PadVoiceId, velocity = 0.8) => {
    const time = audioEngine.currentTime;
    playPadVoice(padId, time, velocity, 0.8);

    // Visual feedback
    set((s) => ({ activePads: new Set(s.activePads).add(padId) }));
    setTimeout(() => {
      set((s) => {
        const next = new Set(s.activePads);
        next.delete(padId);
        return { activePads: next };
      });
    }, 120);

    // Record hit
    const { isRecording, recordingStartTime } = get();
    if (isRecording && recordingStartTime !== null) {
      const timestamp = time - recordingStartTime;
      set((s) => ({
        recordedHits: [...s.recordedHits, { padId, timestamp, velocity }],
      }));
    }
  },

  releasePad: (padId: PadVoiceId) => {
    set((s) => {
      const next = new Set(s.activePads);
      next.delete(padId);
      return { activePads: next };
    });
  },

  setKit: (index: number) => {
    if (index >= 0 && index < KITS.length) {
      set({ currentKit: index });
    }
  },

  loadRoutine: (routine: Routine) => {
    get().stopPlayback();
    set({
      recordedHits: routine.hits,
      currentKit: routine.kit,
      activeRoutineName: routine.name,
      isRecording: false,
      recordingStartTime: null,
      playbackSpeed: 1.0,
    });
  },

  startRecording: () => {
    audioEngine.init();
    set({
      isRecording: true,
      recordingStartTime: audioEngine.currentTime,
      recordedHits: [],
      activeRoutineName: null,
    });
    get().stopPlayback();
  },

  stopRecording: () => {
    set({ isRecording: false });
  },

  clearRecording: () => {
    get().stopPlayback();
    set({ recordedHits: [], recordingStartTime: null, activeRoutineName: null });
  },

  startPlayback: () => {
    const { recordedHits, playbackSpeed, isLooping } = get();
    if (recordedHits.length === 0) return;

    // Stop any existing playback first
    get().stopPlayback();

    const lastHitTime = recordedHits[recordedHits.length - 1].timestamp;
    const loopDuration = Math.ceil(lastHitTime * 2) / 2 + 0.1; // pad slightly

    const scheduleLoop = (offsetMs: number) => {
      const timerIds: number[] = [];

      recordedHits.forEach((hit) => {
        const delayMs = (hit.timestamp / playbackSpeed) * 1000 + offsetMs;
        const id = window.setTimeout(() => {
          const time = audioEngine.currentTime;
          playPadVoice(hit.padId, time, hit.velocity, 0.8);

          // Visual feedback
          set((s) => ({ activePads: new Set(s.activePads).add(hit.padId) }));
          window.setTimeout(() => {
            set((s) => {
              const next = new Set(s.activePads);
              next.delete(hit.padId);
              return { activePads: next };
            });
          }, 100);
        }, delayMs);
        timerIds.push(id);
      });

      if (isLooping) {
        const loopMs = (loopDuration / playbackSpeed) * 1000 + offsetMs;
        const loopId = window.setTimeout(() => {
          if (get().isPlaying) {
            scheduleLoop(0);
          }
        }, loopMs);
        timerIds.push(loopId);
      }

      set((s) => ({
        playbackTimerIds: [...s.playbackTimerIds, ...timerIds],
      }));
    };

    set({ isPlaying: true, playbackTimerIds: [] });
    scheduleLoop(0);
  },

  stopPlayback: () => {
    const { playbackTimerIds } = get();
    playbackTimerIds.forEach((id) => window.clearTimeout(id));
    set({ isPlaying: false, playbackTimerIds: [] });
  },

  toggleLoop: () => {
    set((s) => ({ isLooping: !s.isLooping }));
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },
}));
