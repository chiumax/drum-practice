'use client';

import { useEffect, useRef, useState } from 'react';
import { useLivePracticeStore } from '@/lib/store/useLivePracticeStore';
import { GRADE_TEXT_COLORS } from '@/lib/live-practice/types';

interface ToastEntry {
  id: number;
  grade: string;
  offsetMs: number;
}

let toastId = 0;

export function GradeToast() {
  const lastGrade = useLivePracticeStore((s) => s.lastTapGrade);
  const lastOffset = useLivePracticeStore((s) => s.lastTapOffset);
  const isActive = useLivePracticeStore((s) => s.isActive);

  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const prevGradeRef = useRef(lastGrade);

  useEffect(() => {
    if (!isActive || !lastGrade) return;
    // Only trigger on change (new tap)
    if (lastGrade === prevGradeRef.current && toasts.length > 0) return;
    prevGradeRef.current = lastGrade;

    const id = ++toastId;
    const offsetMs = Math.round(lastOffset * 1000);
    setToasts((prev) => [...prev.slice(-3), { id, grade: lastGrade, offsetMs }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 600);

    return () => clearTimeout(timer);
  }, [lastGrade, lastOffset, isActive]);

  // Reset on session end
  useEffect(() => {
    if (!isActive) setToasts([]);
  }, [isActive]);

  if (toasts.length === 0) return null;

  return (
    <div className="relative h-8 flex items-center justify-center overflow-hidden">
      {toasts.map((toast) => {
        const color = GRADE_TEXT_COLORS[toast.grade as keyof typeof GRADE_TEXT_COLORS] ?? 'text-gray-400';
        const label = toast.grade.charAt(0).toUpperCase() + toast.grade.slice(1);
        const offsetLabel = toast.grade === 'miss'
          ? ''
          : toast.offsetMs === 0
            ? ''
            : toast.offsetMs > 0
              ? ` +${toast.offsetMs}ms`
              : ` ${toast.offsetMs}ms`;

        return (
          <span
            key={toast.id}
            className={`absolute text-sm font-bold uppercase ${color} animate-grade-toast`}
          >
            {label}{offsetLabel && <span className="text-xs font-normal opacity-70">{offsetLabel}</span>}
          </span>
        );
      })}

      <style>{`
        @keyframes grade-toast {
          0% { opacity: 0; transform: translateY(8px) scale(0.9); }
          20% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(-4px) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.95); }
        }
        .animate-grade-toast {
          animation: grade-toast 600ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}
