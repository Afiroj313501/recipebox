import api from './axios';

export async function getSuggestions({ ingredients, mealType, filters }) {
  const { data } = await api.post('/api/suggest', { ingredients, mealType, filters });
  return data;
}
