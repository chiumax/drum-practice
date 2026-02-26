# Changelog

All notable changes to this project will be documented in this file.

## [0.6.0] - 2026-02-27

### Added
- **Floating Grade Toast** — animated label ("Perfect!", "Great +12ms", etc.) floats up and fades after each tap during live practice
- **Timing Deviation Indicator** — horizontal bar showing how early/late each tap is, with color-coded dot (green center → orange edges, ±100ms scale)
- **Streak Combo Display** — combo counter appears at 3+ streak with escalating visual tiers:
  - 3–9: green glow ("Streak")
  - 10–19: yellow pulse ("On Fire")
  - 20+: orange pulsing glow ("Unstoppable")
  - "Streak Lost" flash on break
- **Bar History Strip** — rolling strip of per-bar accuracy blocks below the beat grid, showing last 12 bars color-coded by accuracy
- **Timing Distribution Bar** — stacked colored bar showing percentage breakdown of perfect/great/good/off/miss grades (shown in results modal and progress page)
- **Session Comparison** — results modal now shows accuracy delta vs previous session ("↑12% from last session" or "↓5%")
- **Bar-by-Bar Trend** — mini bar chart in results modal showing accuracy progression across bars within a session
- **Avg Accuracy** tile added to progress dashboard overall stats row
- **Trend Arrows** in progress page per-pattern session list showing accuracy change between sessions

### Changed
- Live practice store tracks `lastTapOffset`, `streakBroken`, and per-bar hit/total counters
- `SessionStats` now includes `barHistory` for post-session analysis
- Results modal redesigned with timing distribution bar, previous session comparison, and bar trend chart
- Progress page pattern details now show timing breakdown bars per session
- Overall stats row expanded from 4 to 5 tiles (added avg accuracy)

## [0.5.0] - 2026-02-19

### Added
- **Practice History & Stats Tracking** — all practice sessions persisted to localStorage
  - Every live session records: pattern, accuracy, BPM, duration, timing stats
  - Loop/tempo-ramp sessions tracked with duration (accuracy only for live mode)
  - Sessions survive page refresh — up to 2,000 sessions stored
- **SM-2 Spaced Repetition** — Anki-style algorithm suggests which patterns to review next
  - Accuracy-to-quality mapping: 95%+ = perfect recall, down to <30% = complete failure
  - Interval progression: 1 day → 6 days → interval × ease factor (capped at 365 days)
  - Ease factor adjusts based on performance (min 1.3, starts at 2.5)
  - Mastery levels: New → Learning → Familiar → Mastered (based on successful repetitions)
- **Progress Dashboard** (`/progress`) — comprehensive practice analytics page
  - Overall stats row: total practice time, session count, patterns practiced, daily streak
  - Due for Review section: horizontal scroll of patterns needing practice, sorted by overdue time
  - Practice Calendar: 12-week GitHub-style heat map showing daily practice intensity
  - Pattern Progress List: per-pattern accordion with accuracy sparklines, best scores, session history
- **Due for Review Banner** on home page — shows count of patterns due with link to progress page
- **Post-session feedback** — "Next review in X days" shown in live results modal after each session
- Header navigation updated with "Progress" link

### Changed
- Live practice page now saves sessions and updates spaced repetition cards on stop
- Practice page now saves loop/tempo-ramp sessions on stop (guard: minimum 5 seconds)
- LiveResultsModal shows next review timing from updated SM-2 card

## [0.4.0] - 2026-02-19

### Added
- **Piano Sight Reading Practice** (`/sight-reading`) — learn to read music notation with a virtual piano
  - Three practice modes: Note Drill (identify single notes), Interval Training (play two-note intervals), Phrase Reading (play short melodies)
  - SVG music staff with treble clef, note heads, sharps, ledger lines
  - On-screen 2-octave piano keyboard (C3-B4) with click/touch support
  - Computer keyboard mapping: Z-M row for C3-B3, Q-U row for C4-B4 (standard DAW layout)
  - Three difficulty levels: Beginner (natural notes, 1 octave), Intermediate (all notes, 2 octaves), Advanced (wider intervals, longer phrases)
  - Real-time stats: accuracy %, streak, best streak, average response time
  - Piano tone synthesis using layered sine oscillators (fundamental + 2 harmonics) via Web Audio API
  - Interval name display for educational feedback (e.g., "Major 3rd", "Perfect 5th")
  - Auto-advance to next challenge after completion
- Header navigation updated with "Sight Read" link

## [0.3.0] - 2026-02-18

### Added
- **21 new drum patterns** across 3 new genres + expanded existing categories:
  - Jazz (4): Jazz Ride Pattern, Jazz Brushes, Jazz Waltz, Bebop Comping
  - Electronic (5): House Beat, Techno, Trap Beat, Drum & Bass, Lo-Fi Hip Hop
  - Polyrhythm (6): 3 over 2, 4 over 3, 3 over 4, 5 over 4, 6 over 4 (Hemiola), Polyrhythmic Rock
  - Rock (4 new): Half-Time Rock, Rock Ballad, Punk Rock, Tom Groove
  - Funk (3 new): JB Funk, Ghost Note Funk, Linear Funk
  - Latin (3 new): Samba, Cascara, Cha-Cha
- **Playback auto-stop** — music stops automatically when navigating between pages or switching browser tabs
- Total pattern count: 12 → 33

### Changed
- Pattern category type expanded to include `jazz`, `electronic`, and `polyrhythm`
- Category filter UI updated with new genre colors (amber for jazz, blue for electronic, pink for polyrhythm)

## [0.2.0] - 2026-02-18

### Added
- **Live Practice mode** (`/live`) — tap along to patterns and get real-time timing accuracy feedback
  - TapMatcher algorithm compares user taps against scheduled beats using `audioContext` timestamps for sub-millisecond precision
  - Timing grades: Perfect (<15ms), Great (<30ms), Good (<50ms), Early/Late (>50ms), Miss
  - Color-coded accuracy overlays on beat grid cells (green/lime/yellow/orange/red)
  - On-screen tap pads with touch support for mobile
  - Real-time stats panel: accuracy %, streak counter, average timing offset, grade breakdown
  - Results modal with session summary on stop
  - Full Kit mode (tap all instruments) and Single Track mode (focus on one)
  - Keyboard mappings: D=kick, F=snare, J=hi-hat, K=open hi-hat, S/A/L=toms, G=crash, H=ride
- Step listener system on Scheduler for external subscribers
- Comprehensive project README with architecture docs, pattern library listing, keyboard shortcuts, and file structure

### Changed
- BeatCell, TrackRow, and BeatGrid components now accept optional `accuracyGrade` / `stepAccuracies` props for live practice overlay
- Scheduler instance is now exported from `useTransportStore` for external access
- Header navigation updated with Live tab

## [0.1.0] - 2026-02-18

### Added
- Initial release
- **Pattern Library** — 12 built-in drum patterns across 5 categories:
  - Rock: Basic Rock Beat, Rock Beat (16ths), Four on the Floor, Basic Shuffle
  - Funk: Basic Funk, Syncopated Funk
  - Latin: Bossa Nova
  - World: 6/8 Feel, Afro 6/8
  - Rudiments: Single Paradiddle, Single Stroke Roll, Double Stroke Roll
- **Visual Beat Grid** — interactive sequencer with click-to-toggle steps, color-coded by instrument
- **Web Audio API drum synthesis** — kick, snare, hi-hat (open/closed), 3 toms, crash, ride
  - All sounds generated programmatically, no audio files
  - Shared pre-generated noise buffer for efficiency
- **Lookahead scheduler** — 25ms setTimeout interval with 100ms schedule-ahead window for precise timing
- **BPM control** — slider (40–240), +/- buttons, tap tempo
- **Per-instrument volume** sliders and mute toggles
- **Swing control** (0–100%)
- **Practice modes** — Loop and Tempo Ramp (gradual BPM increase over N bars)
- **Session stats** — elapsed time, bars played, current BPM
- **Keyboard shortcuts** — Space (play/pause), Escape (stop), arrow keys (BPM +/-1, Shift for +/-10)
- **Sticking labels** (R/L) for rudiment patterns
- **Dark theme** UI with responsive layout
- **localStorage persistence** for user settings (master volume, last pattern)
- Zustand state management (transport, pattern, practice, settings stores)
