import Recipe from '../models/Recipe.js';
import { suggestSchema } from '../validators/suggest.validator.js';
import { PANTRY_STAPLES } from '../config/pantryStaples.js';
import { getValidatedGeminiSuggestions } from '../services/gemini.service.js';

function normalize(list) {
  return list.map((s) => s.toLowerCase().trim()).filter(Boolean);
}

async function getDbMatches(userIngredients, mealType, filters, userId) {
  const query = {
    mealType,
    $or: [{ owner: userId }, { visibility: 'public', status: 'approved' }],
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

  return scored.map(({ recipe, have, missing, score }) => ({
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
}

function formatGeminiResults(geminiResults) {
  return geminiResults.map((result) => ({
    title: result.title,
    mealType: result.mealType,
    prepMinutes: 0,
    cookMinutes: result.timeMinutes,
    have: result.uses,
    missing: result.missing,
    steps: result.steps,
    tags: result.tags,
    score: null,
    isDbRecipe: false,
  }));
}

// POST /api/suggest
export async function suggest(req, res) {
  const parsed = suggestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { mealType, filters } = parsed.data;
  const userIngredients = new Set(normalize(parsed.data.ingredients));

  const dbResults = await getDbMatches(userIngredients, mealType, filters, req.userId);

  // Stage 1 succeeded well enough — return DB results, skip Gemini entirely (free, fast)
  if (dbResults.length >= 3) {
    return res.json({ source: 'db', results: dbResults });
  }

  // Stage 2 — DB was weak, try Gemini
  const geminiResults = await getValidatedGeminiSuggestions(
    parsed.data.ingredients,
    mealType,
    filters
  );

  if (geminiResults) {
    return res.json({
      source: 'ai',
      results: [...dbResults, ...formatGeminiResults(geminiResults)],
    });
  }

  // Gemini failed or timed out — degrade gracefully to whatever DB found, even if < 3
  return res.json({ source: 'db', results: dbResults });
}
