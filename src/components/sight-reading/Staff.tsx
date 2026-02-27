'use client';

import React, { useRef, useEffect } from 'react';
import { ALL_NOTES } from '@/lib/sight-reading/notes';
import { NoteHead } from './NoteHead';

interface StaffProps {
  noteIndices: number[];
  currentNoteIndex: number;
  results?: { correct: boolean }[];
  scrollable?: boolean;
}

// Staff dimensions
const STAFF_HEIGHT = 260;
const STAFF_TOP = 60;       // Y of top staff line
const LINE_SPACING = 14;    // pixels between staff lines
const LEFT_MARGIN = 80;     // space for clef
const NOTE_SPACING = 70;    // horizontal spacing between notes
const BASE_WIDTH = 600;

// Staff line positions (5 lines, top to bottom)
const STAFF_LINES = [0, 1, 2, 3, 4].map((i) => STAFF_TOP + i * LINE_SPACING);

function staffSlotToY(staffSlot: number): number {
  const e4Y = STAFF_LINES[4];
  return e4Y - (staffSlot - 2) * (LINE_SPACING / 2);
}

function getLedgerLines(staffSlot: number): number[] {
  const lines: number[] = [];
  if (staffSlot <= 0) {
    for (let s = 0; s >= staffSlot; s -= 2) {
      lines.push(s);
    }
  }
  if (staffSlot >= 12) {
    for (let s = 12; s <= staffSlot; s += 2) {
      lines.push(s);
    }
  }
  return lines;
}

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
  scrollable,
}: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<(SVGGElement | null)[]>([]);

  const needsScroll = scrollable && noteIndices.length > 7;
  const staffWidth = needsScroll
    ? LEFT_MARGIN + noteIndices.length * NOTE_SPACING + NOTE_SPACING
    : BASE_WIDTH;

  // Auto-scroll to current note
  useEffect(() => {
    if (!needsScroll || !containerRef.current) return;
    const noteEl = noteRefs.current[currentNoteIndex];
    if (noteEl) {
      const container = containerRef.current;
      const noteX = LEFT_MARGIN + currentNoteIndex * NOTE_SPACING;
      const scrollTarget = noteX - container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [currentNoteIndex, needsScroll]);

  const svg = (
    <svg
      viewBox={`0 0 ${staffWidth} ${STAFF_HEIGHT}`}
      className={needsScroll ? undefined : 'w-full max-w-[600px]'}
      width={needsScroll ? staffWidth : undefined}
      height={needsScroll ? STAFF_HEIGHT : undefined}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Staff lines */}
      {STAFF_LINES.map((y, i) => (
        <line
          key={i}
          x1={20}
          y1={y}
          x2={staffWidth - 20}
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

        let color = '#9ca3af';
        if (result) {
          color = result.correct ? '#4ade80' : '#f87171';
        } else if (isCurrent) {
          color = '#60a5fa';
        }

        return (
          <g key={i} ref={(el) => { noteRefs.current[i] = el; }}>
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

  if (needsScroll) {
    return (
      <div
        ref={containerRef}
        className="w-full max-w-[600px] overflow-x-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        {svg}
      </div>
    );
  }

  return svg;
});
