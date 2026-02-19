'use client';

import React from 'react';

interface NoteHeadProps {
  x: number;
  y: number;
  isSharp: boolean;
  color: string;
}

export const NoteHead = React.memo(function NoteHead({
  x,
  y,
  isSharp,
  color,
}: NoteHeadProps) {
  return (
    <g>
      {/* Accidental (sharp symbol) */}
      {isSharp && (
        <text
          x={x - 18}
          y={y + 5}
          fontSize="16"
          fill={color}
          fontFamily="serif"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          ♯
        </text>
      )}

      {/* Filled note head (quarter note style) */}
      <ellipse
        cx={x}
        cy={y}
        rx={7}
        ry={5}
        fill={color}
        transform={`rotate(-10, ${x}, ${y})`}
      />

      {/* Stem */}
      <line
        x1={x + 6.5}
        y1={y}
        x2={x + 6.5}
        y2={y - 30}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
});
