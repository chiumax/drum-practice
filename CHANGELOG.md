# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0] - 2026-02-27

### Added
- **Separate Drums/Piano sections** — Header restructured with two-level navigation; top row for section tabs (Drums, Piano), bottom row for contextual sub-nav. Logo updated to "Music Practice"
- **Note Naming mode** — new sight reading mode where you type the note letter (A-G, with # for sharps) instead of playing on the piano keyboard
- **Popular Melodies** — 10 curated melodies across 3 difficulty levels for guided sight reading practice
  - Beginner: Twinkle Twinkle, Mary Had a Little Lamb, Ode to Joy, Happy Birthday, Hot Cross Buns
  - Intermediate: Für Elise (theme), Canon in D (theme), Greensleeves
  - Advanced: Moonlight Sonata (opening), Chromatic Scale Exercise
  - "Listen" button plays melody reference audio before you practice
  - Scrollable staff for longer melodies with auto-scroll to current note
- **Microphone input** — pitch detection via Web Audio API autocorrelation algorithm for real piano input
  - Mic indicator shows listening status, detected note name, and frequency
  - Input method selector: Computer Keys / Virtual Piano / Microphone
- **Input Method selector** for sight reading — switch between computer keyboard, virtual piano clicks, or microphone

### Changed
- `SightReadingMode` extended with `note-naming` and `melody` modes
- Sight reading store extended with `inputMethod`, `selectedMelodyId`, `submitNoteName`, `startMelody` actions
- Staff component supports `scrollable` prop for horizontal scrolling with auto-scroll
- Sight reading page conditionally renders input areas based on mode and input method

## [0.7.0] - 2026-02-27

### Added
- **Metronome Click** — dedicated sine-wave metronome independent of pattern playback
  - Four modes: Off, All Beats (accent on 1), 2 & 4 only, 1 per Bar
  - Adjustable volume slider
  - Works with all subdivisions (8th, 16th, triplet)
- **Mute Pattern Playback** — toggle to silence the reference pattern, hear only metronome + your taps
- **Mute Tap Sounds** — toggle to silence your own drum hits, forcing internalization of the rhythm
- **Drill Timer** — timed practice mode with preset durations (1, 2, 5, 10 minutes)
  - Countdown display next to play button, pulses red in last 10 seconds
  - Auto-stops session when timer expires
- **Tempo Floor Finder** — analyzes bar-by-bar accuracy after a session to detect the BPM where timing breaks down
  - Groups bars by BPM, finds accuracy cliff (below 70% or 80%)
  - Shows recommended practice tempo (5 BPM below the floor) in results modal
- **Coaching Feedback** — human-readable timing analysis in results modal (up to 3 messages)
  - Per-beat bias: "You're consistently late on beat 3" or "Rushing beat 1"
  - Per-instrument variance: "Your hi-hat timing is the most inconsistent"
  - Bar-half analysis: "Rushing during the second half of each bar"
  - Tempo suggestions: "Clean at 100 BPM — ready to move up 5" or "Try dropping to 85 BPM"

### Changed
- `BarAccuracy` now tracks BPM per bar for tempo floor analysis
- `SessionStats` includes `detailedTaps` array for per-step/per-instrument timing analysis (stripped from localStorage to save space)
- `PracticeSession` extended with optional `drillDurationMs` and `tempoFloor` fields
- Settings store persists metronome mode, metronome volume, mute preferences
- Live practice store tracks drill timer state and bar index for detailed tap recording

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
