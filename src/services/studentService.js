import { apiRequest } from './api';
// PROVISIONAL routes. No page calls these until backend integration is implemented.
export const studentService = {
  list(query = {}, options = {}) { return apiRequest('/students', { ...options, query }); },
  get(id, options = {}) { return apiRequest(`/students/${encodeURIComponent(id)}`, options); },
  create(values, options = {}) { return apiRequest('/students', { ...options, method: 'POST', body: values }); },
  update(id, values, options = {}) { return apiRequest(`/students/${encodeURIComponent(id)}`, { ...options, method: 'PATCH', body: values }); },
};
