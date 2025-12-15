import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Item = {
  id: string;
  label: string;
  onClick: (e?: React.MouseEvent) => void;
  danger?: boolean;
};

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: Item[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function handleDown(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleDown);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleDown);
    };
  }, [onClose]);

  // Intelligent placement after render
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let left = x;
    let top = y;
    if (x + rect.width > winW) left = Math.max(8, x - rect.width);
    if (y + rect.height > winH) top = Math.max(8, y - rect.height);
    setPos({ left, top });
  }, [x, y, items]);

  const menu = (
    <div
      ref={ref}
      style={{ left: pos.left, top: pos.top }}
      className="fixed z-50 min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1"
    >
      {items.map((it) => (
        <button
          key={it.id}
          onClick={(e) => {
            e.stopPropagation();
            it.onClick(e as any);
            onClose();
          }}
          className={`w-full text-left px-3 py-2 text-sm ${it.danger ? 'text-red-600' : 'text-gray-700'} hover:bg-gray-100`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(menu, document.body);
}

export default ContextMenu;
