import { api } from './client';

export const cropsApi = {
  categories: () => api.get('/crops/categories'),
  crops: () => api.get('/crops'),
  products: (cropId?: number) => api.get('/crops/products', { params: { cropId } }),
  directorates: () => api.get('/crops/directorates'),
};
