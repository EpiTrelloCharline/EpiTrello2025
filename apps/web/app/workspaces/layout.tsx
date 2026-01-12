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
              <NotificationBell />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

