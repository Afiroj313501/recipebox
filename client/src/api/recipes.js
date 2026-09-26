import api from './axios';

export async function getMyRecipes() {
  const { data } = await api.get('/api/recipes');
  return data.recipes;
}

export async function getRecipeById(id) {
  const { data } = await api.get(`/api/recipes/${id}`);
  return data.recipe;
}

export async function createRecipe(payload) {
  const { data } = await api.post('/api/recipes', payload);
  return data.recipe;
}

export async function updateRecipe(id, payload) {
  const { data } = await api.patch(`/api/recipes/${id}`, payload);
  return data.recipe;
}

export async function deleteRecipe(id) {
  const { data } = await api.delete(`/api/recipes/${id}`);
  return data;
}