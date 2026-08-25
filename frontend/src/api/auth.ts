import { api } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  refresh: () => api.post('/refresh'),
  me: () => api.get('/me'),
};
