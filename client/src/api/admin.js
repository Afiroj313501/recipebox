import api from './axios';

export async function getPendingRecipes() {
  const { data } = await api.get('/api/admin/recipes/pending');
  return data.recipes;
}

export async function approveRecipe(id) {
  const { data } = await api.patch(`/api/admin/recipes/${id}/approve`);
  return data.recipe;
}

export async function rejectRecipe(id) {
  const { data } = await api.patch(`/api/admin/recipes/${id}/reject`);
  return data.recipe;
}