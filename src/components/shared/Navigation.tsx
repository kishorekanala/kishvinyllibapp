'use client';

import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              <span className="text-violet-600 dark:text-violet-400">Vinyl</span>
              <span className="text-slate-900 dark:text-white">Lib</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
            >
              Gallery
            </Link>
            <Link
              href="/admin"
              className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
