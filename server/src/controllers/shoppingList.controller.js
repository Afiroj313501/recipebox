import { z } from 'zod';
import mongoose from 'mongoose';
import ShoppingList from '../models/ShoppingList.js';
import Recipe from '../models/Recipe.js';

async function getOrCreateList(userId) {
  let list = await ShoppingList.findOne({ owner: userId });
  if (!list) {
    list = await ShoppingList.create({ owner: userId, items: [] });
  }
  return list;
}

function mergeItems(existingItems, newItems) {
  const map = new Map();

  for (const item of existingItems) {
    const key = `${item.name.toLowerCase().trim()}|${(item.unit || '').toLowerCase().trim()}`;
    map.set(key, { name: item.name, unit: item.unit, qty: item.qty, checked: item.checked });
  }

  for (const item of newItems) {
    const name = item.name.toLowerCase().trim();
    const unit = (item.unit || '').toLowerCase().trim();
    const key = `${name}|${unit}`;

    if (map.has(key)) {
      map.get(key).qty += item.qty || 0;
    } else {
      map.set(key, { name: item.name, unit: item.unit, qty: item.qty || 0, checked: false });
    }
  }

  return Array.from(map.values());
}

// GET /api/shopping-list
export async function getShoppingList(req, res) {
  const list = await getOrCreateList(req.userId);
  res.json({ shoppingList: list });
}

// POST /api/shopping-list/from-recipes
const fromRecipesSchema = z.object({
  recipeIds: z.array(z.string()).min(1, 'Select at least one recipe'),
});

export async function addFromRecipes(req, res) {
  const parsed = fromRecipesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const validIds = parsed.data.recipeIds.filter((id) => mongoose.isValidObjectId(id));
  const recipes = await Recipe.find({
    _id: { $in: validIds },
    $or: [{ owner: req.userId }, { visibility: 'public', status: 'approved' }],
  });

  if (recipes.length === 0) {
    return res.status(404).json({ error: 'No accessible recipes found' });
  }

  const newItems = recipes.flatMap((r) =>
    r.ingredients.map((ing) => ({
      name: ing.raw || ing.name,
      qty: ing.qty || 0,
      unit: ing.unit || '',
    }))
  );

  const list = await getOrCreateList(req.userId);
  list.items = mergeItems(list.items, newItems);
  await list.save();

  res.json({ shoppingList: list });
}

// PATCH /api/shopping-list/:itemId
const patchItemSchema = z.object({
  checked: z.boolean(),
});

export async function updateItem(req, res) {
  const parsed = patchItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'checked must be true or false' });
  }

  const list = await ShoppingList.findOne({ owner: req.userId });
  if (!list) {
    return res.status(404).json({ error: 'Shopping list not found' });
  }

  const item = list.items.id(req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.checked = parsed.data.checked;
  await list.save();

  res.json({ shoppingList: list });
}

// DELETE /api/shopping-list/:itemId
export async function deleteItem(req, res) {
  const list = await ShoppingList.findOne({ owner: req.userId });
  if (!list) {
    return res.status(404).json({ error: 'Shopping list not found' });
  }

  list.items = list.items.filter((item) => item._id.toString() !== req.params.itemId);
  await list.save();

  res.json({ shoppingList: list });
}