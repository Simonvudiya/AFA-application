import { api } from './client';

export const consignmentsApi = {
  list: (params?: any) => api.get('/consignments', { params }),
  get: (id: number) => api.get(`/consignments/${id}`),
  create: (data: any) => api.post('/consignments', data),
  update: (id: number, data: any) => api.put(`/consignments/${id}`, data),
  delete: (id: number) => api.delete(`/consignments/${id}`),
  borderToday: (borderId: number) => api.get(`/consignments/border/${borderId}/today`),
  nationalDashboard: () => api.get('/consignments/national/dashboard'),
};
