'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@/lib/api';

type List = { id: string; title: string; position: number };

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const [lists, setLists] = useState<List[]>([]);
  const [title, setTitle] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token || !params?.id) return;

    api(`/lists?boardId=${params.id}`).then(r=>r.json()).then(setLists);
  }, [token, params?.id]);

  const ids = useMemo(()=>lists.map(l=>l.id), [lists]);

  async function createList() {
    if (!title.trim()) return;

    const after = lists.length ? lists[lists.length-1].id : undefined;
    const r = await api('/lists', { method:'POST', body: JSON.stringify({ boardId: params.id, title, after }) });
    const l = await r.json();
    setLists(prev => [...prev, l]);
    setTitle('');
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex(l=>l.id===active.id);
    const newIndex = lists.findIndex(l=>l.id===over.id);
    const next = arrayMove(lists, oldIndex, newIndex);

    // recalcule positions (simple: 1,2,3…)
    const updated = next.map((l, i) => ({ ...l, position: i + 1 }));
    setLists(updated);

    // sync API (on envoie seulement la liste déplacée)
    await api('/lists/move', { method:'POST', body: JSON.stringify({
      listId: active.id, boardId: params.id, newPosition: updated.find(l=>l.id===active.id)!.position
    }) });
  }

  return (
    <div className="h-[calc(100vh-80px)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <input className="border rounded px-3 py-2 w-64" placeholder="Nouvelle colonne"
          value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={createList}>Ajouter une liste</button>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map(l => (
              <Column key={l.id} id={l.id} title={l.title} />
            ))}
            <div className="min-w-[280px]"></div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ——— Composant colonne sortable ———
function Column({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="min-w-[280px] max-w-[320px] bg-gray-50 border rounded-xl p-3 shadow-sm">
      <div className="font-semibold mb-2">{title}</div>
      {/* zone cartes à venir */}
      <div className="space-y-2 min-h-[100px]">
        <div className="text-sm text-gray-400">Ajoute bientôt des cartes…</div>
      </div>
    </div>
  );
}

