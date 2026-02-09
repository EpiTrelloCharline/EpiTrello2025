'use client';

import Link from 'next/link';
import { NotificationBell } from '@/app/components/NotificationBell';

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Epi Trello
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/workspaces"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Workspaces
              </Link>
              <Link
                href="/premium"
                className="text-gray-900 hover:text-black font-medium flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>Premium</span>
              </Link>
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

