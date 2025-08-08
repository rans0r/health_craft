import * as React from 'react';

export interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <ul className="ml-4 list-disc space-y-1 text-sm">
      {ingredients.map((ing, idx) => (
        <li key={idx}>
          {ing.quantity && <span>{ing.quantity} </span>}
          {ing.unit && <span>{ing.unit} </span>}
          <span>{ing.name}</span>
        </li>
      ))}
    </ul>
  );
}

