'use client';

import * as React from 'react';

export interface ShoppingItem {
  name: string;
  checked?: boolean;
}

export interface ShoppingListProps {
  items: ShoppingItem[];
  onChange?: (items: ShoppingItem[]) => void;
}

export function ShoppingList({ items, onChange }: ShoppingListProps) {
  const [localItems, setLocalItems] = React.useState(items);

  const toggle = (index: number) => {
    const next = [...localItems];
    next[index].checked = !next[index].checked;
    setLocalItems(next);
    onChange?.(next);
  };

  return (
    <ul className="space-y-1">
      {localItems.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={item.checked ?? false}
            onChange={() => toggle(idx)}
          />
          <span className={item.checked ? 'line-through' : ''}>{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

