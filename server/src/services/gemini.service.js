import ai from '../config/gemini.js';
import { PANTRY_STAPLES } from '../config/pantryStaples.js';

function sanitize(text) {
  // Strip anything that could break out of the prompt's intent
  return text.replace(/[`{}]/g, '').trim().slice(0, 100);
}

function buildPrompt(ingredients, mealType, filters) {
  const cleanIngredients = ingredients.map(sanitize).join(', ');
  const vegetarian = filters?.vegetarian ? 'vegetarian' : 'none';
  const maxTime = filters?.maxTime ?? 'any';

  return `You are a recipe assistant. Return ONLY valid JSON, no markdown,
no code fences.
User ingredients: ${cleanIngredients}
Meal type: ${sanitize(mealType)}
Dietary: ${vegetarian}
Max time: ${maxTime} minutes

Return an array of exactly 3 objects with this shape:
{
  "title": string,
  "uses": string[],
  "missing": string[],
  "mealType": string,
  "timeMinutes": number,
  "steps": string[],
  "tags": string[]
}
Exclude ${PANTRY_STAPLES.join(', ')} from "missing".
Return only the JSON array.`;
}

export async function callGemini(ingredients, mealType, filters) {
  const prompt = buildPrompt(ingredients, mealType, filters);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6',
      contents: prompt,
    });

    clearTimeout(timeout);

    let text = response.text.trim();
    // Strip accidental code fences even though we asked Gemini not to use them
    text = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

    return JSON.parse(text);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}
