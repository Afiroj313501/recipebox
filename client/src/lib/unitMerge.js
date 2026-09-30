// Merges a flat list of { name, qty, unit } items.
// Only combines items that share both name and unit exactly — no unit conversion yet.
export function mergeIngredients(items) {
  const map = new Map();

  for (const item of items) {
    const name = (item.name || '').toLowerCase().trim();
    const unit = (item.unit || '').toLowerCase().trim();
    const qty = Number(item.qty) || 0;

    if (!name) continue;

    const key = `${name}|${unit}`;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.qty += qty;
    } else {
      map.set(key, { name, unit, qty });
    }
  }

  return Array.from(map.values());
}

// Placeholder for future unit conversion (tsp<->tbsp, cup<->ml, etc.)
// When implemented, mergeIngredients would check this map before falling back
// to treating different units as separate line items.
export const CONVERSIONS = {
  // tbsp: { tsp: 3 },
  // tsp: { tbsp: 1 / 3 },
  // cup: { ml: 236.588 },
  // ml: { cup: 1 / 236.588 },
};