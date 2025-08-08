export interface PantryItem {
  name: string;
  quantity: number;
  unit?: string;
  section?: string;
  allergens?: string[];
}

export function addToPantry(
  pantry: PantryItem[],
  items: PantryItem[],
): PantryItem[] {
  const map = new Map<string, PantryItem>();
  pantry.forEach((p) => map.set(p.name, { ...p }));
  items.forEach((item) => {
    const existing = map.get(item.name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(item.name, { ...item });
    }
  });
  return Array.from(map.values());
}

export function getAllergenWarnings(
  pantry: PantryItem[],
  allergens: string[],
): { item: PantryItem; allergens: string[] }[] {
  const warnings: { item: PantryItem; allergens: string[] }[] = [];
  pantry.forEach((item) => {
    const found = item.allergens?.filter((a) =>
      allergens.includes(a.toLowerCase()),
    );
    if (found && found.length) {
      warnings.push({ item, allergens: found });
    }
  });
  return warnings;
}
