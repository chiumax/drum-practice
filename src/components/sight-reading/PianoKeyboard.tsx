'use client';

import React, { useCallback } from 'react';
import { ALL_NOTES } from '@/lib/sight-reading/notes';

interface PianoKeyboardProps {
  onNotePlay: (noteIndex: number) => void;
  activeNote: number | null;
}

// White key indices in our 24-note range (C3-B4)
const WHITE_KEY_INDICES = ALL_NOTES
  .filter((n) => !n.isSharp)
  .map((n) => n.index);

// Black key info: position relative to previous white key
interface BlackKeyInfo {
  noteIndex: number;
  leftWhiteIndex: number; // index of the white key to the left
}

const BLACK_KEY_INFOS: BlackKeyInfo[] = ALL_NOTES
  .filter((n) => n.isSharp)
  .map((n) => ({
    noteIndex: n.index,
    leftWhiteIndex: n.index - 1, // sharp is always 1 semitone above the natural
  }));

const WHITE_KEY_WIDTH = 36;
const WHITE_KEY_HEIGHT = 140;
const BLACK_KEY_WIDTH = 22;
const BLACK_KEY_HEIGHT = 88;

export const PianoKeyboard = React.memo(function PianoKeyboard({
  onNotePlay,
  activeNote,
}: PianoKeyboardProps) {
  const handleWhiteKey = useCallback(
    (noteIndex: number) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      onNotePlay(noteIndex);
    },
    [onNotePlay]
  );

  const handleBlackKey = useCallback(
    (noteIndex: number) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onNotePlay(noteIndex);
    },
    [onNotePlay]
  );

  const totalWidth = WHITE_KEY_INDICES.length * WHITE_KEY_WIDTH;

  // Build a map of white key index → x position
  const whiteKeyPositions = new Map<number, number>();
  WHITE_KEY_INDICES.forEach((noteIndex, i) => {
    whiteKeyPositions.set(noteIndex, i * WHITE_KEY_WIDTH);
  });

  return (
    <div className="relative select-none overflow-x-auto">
      <div
        className="relative mx-auto"
        style={{ width: totalWidth, height: WHITE_KEY_HEIGHT }}
      >
        {/* White keys */}
        {WHITE_KEY_INDICES.map((noteIndex, i) => {
          const note = ALL_NOTES[noteIndex];
          const x = i * WHITE_KEY_WIDTH;
          const isActive = activeNote === noteIndex;

          return (
            <button
              key={noteIndex}
              onMouseDown={handleWhiteKey(noteIndex)}
              onTouchStart={handleWhiteKey(noteIndex)}
              className="absolute border border-gray-600 rounded-b-md transition-colors duration-75 cursor-pointer"
              style={{
                left: x,
                top: 0,
                width: WHITE_KEY_WIDTH - 1,
                height: WHITE_KEY_HEIGHT,
                backgroundColor: isActive ? '#60a5fa' : '#e5e7eb',
                zIndex: 1,
              }}
            >
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium">
                {note.name}
              </span>
              <span className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 uppercase">
                {note.keyboardKey}
              </span>
            </button>
          );
        })}

        {/* Black keys */}
        {BLACK_KEY_INFOS.map(({ noteIndex, leftWhiteIndex }) => {
          const leftWhiteX = whiteKeyPositions.get(leftWhiteIndex);
          if (leftWhiteX === undefined) return null;

          const note = ALL_NOTES[noteIndex];
          const x = leftWhiteX + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
          const isActive = activeNote === noteIndex;

          return (
            <button
              key={noteIndex}
              onMouseDown={handleBlackKey(noteIndex)}
              onTouchStart={handleBlackKey(noteIndex)}
              className="absolute rounded-b-md transition-colors duration-75 cursor-pointer"
              style={{
                left: x,
                top: 0,
                width: BLACK_KEY_WIDTH,
                height: BLACK_KEY_HEIGHT,
                backgroundColor: isActive ? '#3b82f6' : '#1f2937',
                zIndex: 2,
              }}
            >
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-medium">
                {note.keyboardKey}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
