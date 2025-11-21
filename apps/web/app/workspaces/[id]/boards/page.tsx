'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { api } from '@/lib/api';

type Board = { id: string; title: string };

export default function WorkspaceBoardsPage() {
  const params = useParams<{ id: string }>();
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token || !params?.id) return;

    api(`/boards?workspaceId=${params.id}`).then(r => r.json()).then(setBoards);
  }, [token, params?.id]);

  const create = async () => {
    if (!title.trim()) return;
    const r = await api('/boards', { method:'POST', body:JSON.stringify({ title, workspaceId: params.id }) });
    const b = await r.json();
    setBoards(p => [b, ...p]);
    setTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableaux</h1>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Nom du tableau"
          value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white" onClick={create}>Créer</button>
      </div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {boards.map(b=>(
          <li key={b.id}>
            <a className="block rounded-lg border p-4 hover:shadow"
               href={`/boards/${b.id}`}>{b.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

