import api from './axios';

export async function registerUser({ name, email, password }) {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/api/auth/me');
  return data;
}