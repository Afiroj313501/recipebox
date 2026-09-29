import api from './axios';

export async function getComments(recipeId) {
  const { data } = await api.get(`/api/recipes/${recipeId}/comments`);
  return data.comments;
}

export async function createComment(recipeId, text) {
  const { data } = await api.post(`/api/recipes/${recipeId}/comments`, { text });
  return data.comment;
}

export async function deleteComment(commentId) {
  const { data } = await api.delete(`/api/comments/${commentId}`);
  return data;
}
