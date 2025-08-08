import { openai } from './openai';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
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
  { id: 'r1', title: 'Vegan Tacos', ingredients: ['tortillas', 'beans', 'salsa'], tags: ['vegan'] },
  { id: 'r2', title: 'Grilled Chicken', ingredients: ['chicken', 'lettuce', 'tomatoes'], tags: ['gluten-free'] },
  { id: 'r3', title: 'Pasta Primavera', ingredients: ['pasta', 'tomato sauce', 'vegetables'], tags: [] },
];

export async function generateMealPlan(constraints: string): Promise<MealPlan> {
  try {
    if (process.env.OPENAI_API_KEY) {
      const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: `Create a 7 day meal plan with breakfast, lunch and dinner for each day. Respect these dietary constraints: ${constraints}. Return JSON in format { days: [ { day: "Monday", meals: { breakfast: { title: string, ingredients: string[] }, lunch: {...}, dinner: {...} } } ] }`,
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

export function calculateShoppingList(plan: MealPlan): string[] {
  const items = new Set<string>();
  plan.forEach((day) => {
    MEAL_SLOTS.forEach((slot) => {
      const recipe = day.meals[slot];
      recipe?.ingredients.forEach((ing) => items.add(ing));
    });
  });
  return Array.from(items);
}
