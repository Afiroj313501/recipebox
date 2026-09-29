import api from './axios';

export async function getUserProfile(userId) {
  const { data } = await api.get(`/api/users/${userId}`);
  return data;
}
