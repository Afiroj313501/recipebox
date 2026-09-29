import Recipe from '../models/Recipe.js';
import { suggestSchema } from '../validators/suggest.validator.js';
import { PANTRY_STAPLES } from '../config/pantryStaples.js';

function normalize(list) {
  return list.map((s) => s.toLowerCase().trim()).filter(Boolean);
}

// POST /api/suggest
export async function suggest(req, res) {
  const parsed = suggestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { mealType, filters } = parsed.data;
  const userIngredients = new Set(normalize(parsed.data.ingredients));

  // Only match against recipes visible to this user: their own, or approved public ones
  const query = {
    mealType,
    $or: [
      { owner: req.userId },
      { visibility: 'public', status: 'approved' },
    ],
  };

  if (filters?.maxTime) {
    query.$expr = {
      $lte: [{ $add: ['$prepMinutes', '$cookMinutes'] }, filters.maxTime],
    };
  }

  const candidates = await Recipe.find(query).limit(200);

  const scored = candidates
    .map((recipe) => {
      const have = [];
      const missing = [];

      for (const ing of recipe.ingredients) {
        const name = ing.name.toLowerCase().trim();
        if (userIngredients.has(name)) {
          have.push(name);
        } else if (!PANTRY_STAPLES.includes(name)) {
          missing.push(name);
        }
      }

      const total = have.length + missing.length;
      const score = total === 0 ? 0 : have.length / total;

      return { recipe, have, missing, score };
    })
    .filter((result) => result.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const results = scored.map(({ recipe, have, missing, score }) => ({
    _id: recipe._id,
    title: recipe.title,
    imageUrl: recipe.imageUrl,
    mealType: recipe.mealType,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    have,
    missing,
    score: Math.round(score * 100) / 100,
    isDbRecipe: true,
  }));

  // Stage 2 (Gemini) plugs in here later when results.length < 3 — Phase 5
  res.json({ source: 'db', results });
}
