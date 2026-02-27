'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Section = 'drums' | 'piano';

const sections: { id: Section; label: string; emoji: string }[] = [
  { id: 'drums', label: 'Drums', emoji: '🥁' },
  { id: 'piano', label: 'Piano', emoji: '🎹' },
];

const sectionNav: Record<Section, { href: string; label: string }[]> = {
  drums: [
    { href: '/', label: 'Patterns' },
    { href: '/practice', label: 'Practice' },
    { href: '/live', label: 'Live' },
    { href: '/progress', label: 'Progress' },
  ],
  piano: [
    { href: '/sight-reading', label: 'Sight Read' },
  ],
};

function getActiveSection(pathname: string): Section {
  if (pathname.startsWith('/sight-reading')) return 'piano';
  return 'drums';
}

export function Header() {
  const pathname = usePathname();
  const activeSection = getActiveSection(pathname);
  const subNav = sectionNav[activeSection];

  return (
    <header className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Top row: logo + section tabs */}
        <div className="h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#0f1117" strokeWidth="2" />
                <circle cx="8" cy="8" r="2" fill="#0f1117" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight">Music Practice</span>
          </Link>

          <div className="flex items-center gap-1">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={sectionNav[s.id][0].href}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${activeSection === s.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                  }
                `}
              >
                <span className="mr-1.5">{s.emoji}</span>
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sub-nav row */}
        {subNav.length > 0 && (
          <div className="h-10 flex items-center gap-1 -mb-px">
            {subNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 py-1 rounded-md text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-gray-700/60 text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
