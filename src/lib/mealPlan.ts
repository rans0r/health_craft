import { openai } from './openai';

export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string;
  section?: string;
  allergens?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  tags: string[];
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

export interface DayPlan {
  day: string;
  meals: Record<MealSlot, Recipe | null>;
}

export type MealPlan = DayPlan[];

export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Vegan Tacos',
    ingredients: [
      { name: 'tortillas', quantity: 8, unit: 'pieces', section: 'Grains' },
      { name: 'beans', quantity: 2, unit: 'cups', section: 'Canned', allergens: ['legume'] },
      { name: 'salsa', quantity: 1, unit: 'jar', section: 'Produce' },
    ],
    tags: ['vegan'],
  },
  {
    id: 'r2',
    title: 'Grilled Chicken',
    ingredients: [
      { name: 'chicken', quantity: 1, unit: 'lb', section: 'Meat' },
      { name: 'lettuce', quantity: 1, unit: 'head', section: 'Produce' },
      { name: 'tomatoes', quantity: 2, unit: 'pcs', section: 'Produce' },
    ],
    tags: ['gluten-free'],
  },
  {
    id: 'r3',
    title: 'Pasta Primavera',
    ingredients: [
      { name: 'pasta', quantity: 1, unit: 'box', section: 'Grains', allergens: ['gluten'] },
      { name: 'tomato sauce', quantity: 1, unit: 'jar', section: 'Canned' },
      { name: 'vegetables', quantity: 3, unit: 'cups', section: 'Produce' },
    ],
    tags: [],
  },
];

export async function generateMealPlan(constraints: string): Promise<MealPlan> {
  try {
    if (process.env.OPENAI_API_KEY) {
      const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: `Create a 7 day meal plan with breakfast, lunch and dinner for each day. Respect these dietary constraints: ${constraints}. Return JSON in format { days: [ { day: "Monday", meals: { breakfast: { title: string, ingredients: [{name, quantity, unit?, section?, allergens?: string[]}] }, lunch: {...}, dinner: {...} } } ] }`,
      });
      const text = (response as any).output_text || (response as any).choices?.[0]?.message?.content || '{}';
      const json = JSON.parse(text);
      if (Array.isArray(json.days)) {
        return json.days as MealPlan;
      }
    }
  } catch {
    // fall back to local generation
  }

  const diets = constraints.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const allowed = diets.length
    ? SAMPLE_RECIPES.filter((r) => diets.every((d) => r.tags.includes(d)))
    : SAMPLE_RECIPES;

  return DAYS.map((day, i) => ({
    day,
    meals: {
      breakfast: allowed[i % allowed.length] || null,
      lunch: allowed[(i + 1) % allowed.length] || null,
      dinner: allowed[(i + 2) % allowed.length] || null,
    },
  }));
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit?: string;
  allergens?: string[];
}

export type ShoppingList = Record<string, ShoppingItem[]>; // section -> items

export function calculateShoppingList(plan: MealPlan): ShoppingList {
  const bySection: Record<string, Record<string, ShoppingItem>> = {};

  plan.forEach((day) => {
    MEAL_SLOTS.forEach((slot) => {
      const recipe = day.meals[slot];
      recipe?.ingredients.forEach((ing) => {
        const section = ing.section || 'Other';
        bySection[section] ||= {};
        const existing = bySection[section][ing.name];
        if (existing) {
          existing.quantity += ing.quantity;
        } else {
          bySection[section][ing.name] = {
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            allergens: ing.allergens,
          };
        }
      });
    });
  });

  const result: ShoppingList = {};
  Object.entries(bySection).forEach(([section, items]) => {
    result[section] = Object.values(items);
  });

  return result;
}
