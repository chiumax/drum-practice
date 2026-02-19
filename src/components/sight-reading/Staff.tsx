'use client';

import React from 'react';
import { ALL_NOTES } from '@/lib/sight-reading/notes';
import { NoteHead } from './NoteHead';

interface StaffProps {
  noteIndices: number[];
  currentNoteIndex: number;
  results?: { correct: boolean }[];
}

// Staff dimensions
const STAFF_WIDTH = 600;
const STAFF_HEIGHT = 260;
const STAFF_TOP = 60;       // Y of top staff line
const LINE_SPACING = 14;    // pixels between staff lines
const LEFT_MARGIN = 80;     // space for clef
const NOTE_SPACING = 70;    // horizontal spacing between notes

// Staff line positions (5 lines, top to bottom)
// Treble clef lines from top: F5, D5, B4, G4, E4
const STAFF_LINES = [0, 1, 2, 3, 4].map((i) => STAFF_TOP + i * LINE_SPACING);

// Map staffSlot to Y position
// staffSlot: diatonic steps from C4.
// E4 (staffSlot=2) is on the bottom staff line (STAFF_LINES[4])
// Each diatonic step = LINE_SPACING / 2
function staffSlotToY(staffSlot: number): number {
  // E4 has staffSlot = 2, sits on STAFF_LINES[4]
  // Each step up = LINE_SPACING/2 pixels up
  const e4Y = STAFF_LINES[4]; // bottom line
  return e4Y - (staffSlot - 2) * (LINE_SPACING / 2);
}

// Determine which ledger lines are needed for a note
function getLedgerLines(staffSlot: number): number[] {
  const lines: number[] = [];

  // Ledger lines below staff (below E4, staffSlot < 2)
  // Middle C (C4, staffSlot=0) needs one ledger line
  // B3 (staffSlot=-1) sits just below that ledger line (no extra)
  // A3 (staffSlot=-2) needs the C ledger line
  // etc.
  if (staffSlot <= 0) {
    // Need ledger lines at staffSlot 0 (C4), -2 (A3), -4 (F3), -6 (D3)
    for (let s = 0; s >= staffSlot; s -= 2) {
      lines.push(s);
    }
  }

  // Ledger lines above staff (above F5, staffSlot > 10)
  if (staffSlot >= 12) {
    for (let s = 12; s <= staffSlot; s += 2) {
      lines.push(s);
    }
  }

  return lines;
}

// Treble clef SVG path (simplified)
function TrebleClef() {
  return (
    <text
      x={35}
      y={STAFF_LINES[4] + 10}
      fontSize="72"
      fill="#9ca3af"
      fontFamily="serif"
      style={{ userSelect: 'none' }}
    >
      {'\u{1D11E}'}
    </text>
  );
}

export const Staff = React.memo(function Staff({
  noteIndices,
  currentNoteIndex,
  results,
}: StaffProps) {
  return (
    <svg
      viewBox={`0 0 ${STAFF_WIDTH} ${STAFF_HEIGHT}`}
      className="w-full max-w-[600px]"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Staff lines */}
      {STAFF_LINES.map((y, i) => (
        <line
          key={i}
          x1={20}
          y1={y}
          x2={STAFF_WIDTH - 20}
          y2={y}
          stroke="#4b5563"
          strokeWidth={1}
        />
      ))}

      {/* Treble clef */}
      <TrebleClef />

      {/* Notes */}
      {noteIndices.map((noteIndex, i) => {
        const note = ALL_NOTES[noteIndex];
        if (!note) return null;

        const x = LEFT_MARGIN + i * NOTE_SPACING + NOTE_SPACING / 2;
        const y = staffSlotToY(note.staffSlot);
        const ledgerSlots = getLedgerLines(note.staffSlot);
        const isCurrent = i === currentNoteIndex;
        const result = results?.[i];

        let color = '#9ca3af'; // default gray
        if (result) {
          color = result.correct ? '#4ade80' : '#f87171'; // green or red
        } else if (isCurrent) {
          color = '#60a5fa'; // blue highlight for current
        }

        return (
          <g key={i}>
            {/* Ledger lines */}
            {ledgerSlots.map((slot) => {
              const ly = staffSlotToY(slot);
              return (
                <line
                  key={`ledger-${slot}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke="#4b5563"
                  strokeWidth={1}
                />
              );
            })}

            {/* Note head */}
            <NoteHead
              x={x}
              y={y}
              isSharp={note.isSharp}
              color={color}
            />
          </g>
        );
      })}
    </svg>
  );
});
