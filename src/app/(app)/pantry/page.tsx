'use client';

import { useState } from 'react';
import type { PantryItem } from '@/lib/pantry';
import { addToPantry, getAllergenWarnings } from '@/lib/pantry';

const HOUSEHOLD_ALLERGENS = ['peanut', 'gluten'];

export default function PantryPage() {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [allergens, setAllergens] = useState('');

  const add = () => {
    if (!name) return;
    const item: PantryItem = {
      name,
      quantity: 1,
      section,
      allergens: allergens
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean),
    };
    setPantry((p) => addToPantry(p, [item]));
    setName('');
    setSection('');
    setAllergens('');
  };

  const warnings = getAllergenWarnings(pantry, HOUSEHOLD_ALLERGENS);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Pantry</h1>
      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="item"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="allergens"
          value={allergens}
          onChange={(e) => setAllergens(e.target.value)}
        />
        <button
          onClick={add}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="mt-4 text-red-600">
          <h2 className="font-semibold">Allergen Warnings</h2>
          <ul className="list-disc pl-6">
            {warnings.map((w) => (
              <li key={w.item.name}>
                {w.item.name}: {w.allergens.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-4 list-disc pl-6">
        {pantry.map((p) => (
          <li key={p.name}>
            {p.name} {p.section && `(${p.section})`}
          </li>
        ))}
      </ul>
    </main>
  );
}

