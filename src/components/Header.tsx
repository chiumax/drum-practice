'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Patterns' },
  { href: '/practice', label: 'Practice' },
  { href: '/live', label: 'Live' },
  { href: '/sight-reading', label: 'Sight Read' },
  { href: '/progress', label: 'Progress' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#0f1117" strokeWidth="2" />
              <circle cx="8" cy="8" r="2" fill="#0f1117" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight">Drum Practice</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-3 py-1.5 rounded-lg text-sm transition-colors
                ${pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
