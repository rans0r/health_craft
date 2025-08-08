'use client';

import * as React from 'react';

export interface PantryItem {
  name: string;
  quantity?: string;
}

export interface PantryEditorProps {
  items: PantryItem[];
  onChange?: (items: PantryItem[]) => void;
}

export function PantryEditor({ items, onChange }: PantryEditorProps) {
  const [localItems, setLocalItems] = React.useState(items);

  const updateItem = (
    index: number,
    field: keyof PantryItem,
    value: string
  ) => {
    const next = [...localItems];
    next[index] = { ...next[index], [field]: value };
    setLocalItems(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      {localItems.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            className="flex-1 border px-2 py-1"
            value={item.name}
            onChange={(e) => updateItem(idx, 'name', e.target.value)}
          />
          <input
            className="w-24 border px-2 py-1"
            value={item.quantity ?? ''}
            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

