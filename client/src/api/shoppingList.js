import api from './axios';

export async function getShoppingList() {
  const { data } = await api.get('/api/shopping-list');
  return data.shoppingList;
}

export async function addFromRecipes(recipeIds) {
  const { data } = await api.post('/api/shopping-list/from-recipes', { recipeIds });
  return data.shoppingList;
}

export async function updateShoppingItem(itemId, checked) {
  const { data } = await api.patch(`/api/shopping-list/${itemId}`, { checked });
  return data.shoppingList;
}

export async function deleteShoppingItem(itemId) {
  const { data } = await api.delete(`/api/shopping-list/${itemId}`);
  return data.shoppingList;
}
