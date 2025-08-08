'use client';

import { useEffect, useState } from 'react';
import type { MealPlan, MealSlot } from '@/lib/mealPlan';
import { MEAL_SLOTS, calculateShoppingList } from '@/lib/mealPlan';

export default function MealPlanPage() {
  const [constraints, setConstraints] = useState('');
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [drag, setDrag] = useState<{ day: number; slot: MealSlot } | null>(null);

  const generate = async () => {
    const res = await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ constraints }),
    });
    const data = await res.json();
    setPlan(data.plan);
  };

  useEffect(() => {
    if (plan) {
      setShoppingList(calculateShoppingList(plan));
    }
  }, [plan]);

  const onDragStart = (day: number, slot: MealSlot) => () => {
    setDrag({ day, slot });
  };

  const onDrop = (day: number, slot: MealSlot) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!plan || !drag) return;
    const next = plan.map((d) => ({ ...d, meals: { ...d.meals } }));
    const recipe = next[drag.day].meals[drag.slot];
    next[drag.day].meals[drag.slot] = next[day].meals[slot];
    next[day].meals[slot] = recipe;
    setPlan(next);
    setDrag(null);
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Meal Plan</h1>
      <p className="mt-2">Generate and edit your weekly meal plans.</p>

      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="Dietary constraints (e.g. vegan, gluten-free)"
        />
        <button
          onClick={generate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate
        </button>
      </div>

      {plan && (
        <>
          <div className="grid grid-cols-7 gap-2 mt-4">
            {plan.map((day, di) => (
              <div key={day.day} className="border p-2">
                <h3 className="font-semibold text-center">{day.day}</h3>
                {MEAL_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="border p-1 mt-1 min-h-[40px]"
                    draggable={!!day.meals[slot]}
                    onDragStart={onDragStart(di, slot)}
                    onDragOver={allowDrop}
                    onDrop={onDrop(di, slot)}
                  >
                    {day.meals[slot]?.title || (
                      <span className="text-gray-400">{slot}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold">Shopping List</h2>
            <ul className="list-disc pl-6">
              {shoppingList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
