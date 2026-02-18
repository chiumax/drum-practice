# Drum Practice

A web-based drumming practice app for rhythm training. Features a visual beat grid/sequencer, synthesized drum sounds, a library of common patterns and rudiments, and practice tools like tempo ramping and live tap-along mode.

**No audio files needed** — all drum sounds are generated in real-time using the Web Audio API.

## Features

- **Pattern Library** — 12 built-in patterns across rock, funk, latin, world, and rudiment categories
- **Visual Beat Grid** — Interactive sequencer with click-to-toggle steps, color-coded by instrument
- **Synthesized Drums** — Kick, snare, hi-hat (open/closed), 3 toms, crash, and ride cymbals
- **Precise Timing** — Lookahead scheduler using the Web Audio clock for rock-solid rhythm
- **BPM Control** — Slider, +/- buttons, and tap tempo (40–240 BPM)
- **Swing** — Adjustable swing feel (0–100%)
- **Practice Modes** — Loop and Tempo Ramp (gradually increase speed over N bars)
- **Live Practice** — Tap along to patterns and get real-time timing accuracy feedback
- **Per-Instrument Volume** — Individual volume and mute controls for each track
- **Keyboard Shortcuts** — Space (play/pause), Escape (stop), arrow keys (BPM)
- **Dark Theme** — Easy on the eyes during practice sessions
- **Mobile Responsive** — Horizontally scrollable grid, stacked controls on small screens

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs) (state management)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (sound synthesis + scheduling)

## Architecture

### Audio Engine (`src/lib/audio/`)

- **AudioEngine.ts** — Singleton managing `AudioContext` → `DynamicsCompressor` → `GainNode` → `destination`. Lazy-initialized on first user gesture (browser autoplay policy). Pre-generates a shared white noise buffer for snare/hi-hat/cymbal synthesis.
- **DrumSynth.ts** — Pure functions that create short-lived Web Audio nodes for each drum sound:
  - Kick: triangle + sine oscillators with pitch envelope
  - Snare: filtered white noise + triangle oscillator body
  - Hi-hat: 6 square-wave oscillators at metallic frequency ratios, bandpass/highpass filtered
  - Toms: sine oscillator with pitch sweep (3 variants)
  - Crash/Ride: filtered white noise with long/medium decay
- **Scheduler.ts** — Lookahead scheduler (25ms `setTimeout` interval, 100ms schedule-ahead window). Schedules notes against the precise Web Audio clock. Supports swing timing and bar counting.

### Pattern Data (`src/lib/patterns/`)

Each pattern defines tracks (instruments) with step arrays. Supports 4/4, 3/4, and 6/8 time signatures with 8th note, 16th note, and triplet subdivisions.

| Pattern | Category | Time Sig | Subdivision | Default BPM |
|---|---|---|---|---|
| Basic Rock Beat | Rock | 4/4 | 8th | 100 |
| Rock Beat (16ths) | Rock | 4/4 | 16th | 90 |
| Four on the Floor | Rock | 4/4 | 8th | 120 |
| Basic Shuffle | Rock | 4/4 | Triplet | 100 |
| Basic Funk | Funk | 4/4 | 16th | 95 |
| Syncopated Funk | Funk | 4/4 | 16th | 90 |
| Bossa Nova | Latin | 4/4 | 16th | 130 |
| 6/8 Feel | World | 6/8 | 8th | 80 |
| Afro 6/8 | World | 6/8 | 8th | 90 |
| Single Paradiddle | Rudiment | 4/4 | 16th | 80 |
| Single Stroke Roll | Rudiment | 4/4 | 16th | 80 |
| Double Stroke Roll | Rudiment | 4/4 | 16th | 70 |

### State Management (`src/lib/store/`)

Uses Zustand stores with no providers needed:

- **useTransportStore** — Play/pause/stop state, BPM, current step, swing
- **usePatternStore** — Current pattern, step toggling, track volume/mute
- **usePracticeStore** — Practice mode (loop/tempo-ramp), session stats
- **useSettingsStore** — Master volume, persisted to localStorage
- **useLivePracticeStore** — Live tap-along mode state, accuracy tracking

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| Escape | Stop |
| Arrow Up | BPM +1 |
| Arrow Down | BPM -1 |
| Shift + Arrow Up | BPM +10 |
| Shift + Arrow Down | BPM -10 |

### Live Practice Keys

| Key | Instrument |
|-----|-----------|
| D | Kick |
| F | Snare |
| J | Hi-Hat (closed) |
| K | Hi-Hat (open) |
| S | Tom High |
| A | Tom Mid |
| L | Tom Low |
| G | Crash |
| H | Ride |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, dark theme
│   ├── page.tsx                # Pattern library (home)
│   ├── practice/page.tsx       # Sequencer practice view
│   └── live/page.tsx           # Live tap-along practice
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── sequencer/              # BeatGrid, BeatCell, TrackRow
│   ├── controls/               # Transport, BPM, Volume, Swing
│   ├── practice/               # Mode selector, tempo ramp, stats
│   └── live/                   # Tap pads, live stats, results
├── lib/
│   ├── audio/                  # AudioEngine, DrumSynth, Scheduler
│   ├── patterns/               # Types, pattern data, utilities
│   ├── live-practice/          # TapMatcher, types
│   ├── store/                  # Zustand stores
│   └── hooks/                  # Keyboard shortcuts, live input
```

## Building

```bash
npm run build
```

## License

MIT
