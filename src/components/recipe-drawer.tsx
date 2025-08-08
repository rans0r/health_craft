'use client';

import * as React from 'react';

export interface RecipeDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function RecipeDrawer({ open, onClose, children }: RecipeDrawerProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/50"
      onClick={onClose}
    >
      <aside
        className="ml-auto h-full w-80 overflow-y-auto bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );
}

