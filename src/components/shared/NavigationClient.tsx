'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCallback } from 'react';

export function NavigationClient() {
  const { data: session } = useSession();

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              <span className="text-violet-600">KishSat</span>
              <span className="text-slate-900">VinylLibrary</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-slate-700 hover:text-violet-600 transition"
            >
              Gallery
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/admin"
                  className="text-slate-700 hover:text-violet-600 transition"
                >
                  Admin
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-600">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-700 hover:text-red-600 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-slate-700 hover:text-violet-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
