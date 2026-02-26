'use client';

import React from 'react';

interface PatternAccuracySparklineProps {
  values: number[]; // accuracy percentages (0-100), most recent last
  width?: number;
  height?: number;
}

export const PatternAccuracySparkline = React.memo(function PatternAccuracySparkline({
  values,
  width = 80,
  height = 28,
}: PatternAccuracySparklineProps) {
  if (values.length === 0) return null;

  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  if (values.length === 1) {
    // Single point — draw a dot
    const y = padding + innerH - (values[0] / 100) * innerH;
    return (
      <svg width={width} height={height} className="block">
        <circle cx={width / 2} cy={y} r={2.5} fill="#4ade80" />
      </svg>
    );
  }

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * innerW;
    const y = padding + innerH - (v / 100) * innerH;
    return `${x},${y}`;
  });

  const lastX = padding + innerW;
  const lastY = padding + innerH - (values[values.length - 1] / 100) * innerH;

  return (
    <svg width={width} height={height} className="block">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#4ade80"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill="#4ade80" />
    </svg>
  );
});
