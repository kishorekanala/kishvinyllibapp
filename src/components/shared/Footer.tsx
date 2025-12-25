'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">KishoreVinylLibrary</h3>
            <p className="text-slate-400">
              A modern web application for managing and browsing vinyl record collections.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Project</h4>
            <p className="text-slate-400">
              Built with Next.js, React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-slate-400">
            &copy; {currentYear} KishoreVinylLibrary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
