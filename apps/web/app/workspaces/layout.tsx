'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationBell } from '@/app/components/NotificationBell';

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Epi Trello
            </Link>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Recherche globale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-md py-1.5 pl-10 pr-3 text-sm focus:ring-0 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </form>
              <Link
                href="/workspaces"
                className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
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

