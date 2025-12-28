'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function Navigation() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              <span className="text-violet-600 dark:text-violet-400">KishSat</span>
              <span className="text-slate-900 dark:text-white">VinylLibrary</span>
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
            {session?.user ? (
              <>
                <Link
                  href="/admin"
                  className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Admin
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {session.user.email}
                  </span>
                  {isMounted && (
                    <button
                      onClick={toggleTheme}
                      className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                      aria-label="Toggle dark mode"
                    >
                      {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {isMounted && (
                  <button
                    onClick={toggleTheme}
                    className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    aria-label="Toggle dark mode"
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                )}
                <Link
                  href="/auth/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
