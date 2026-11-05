import { apiRequest } from './api';
// Each create request represents a NEW session. Feature/payload mapping is pending.
export const screeningService = {
  list(query = {}, options = {}) { return apiRequest('/screenings', { ...options, query }); },
  get(id, options = {}) { return apiRequest(`/screenings/${encodeURIComponent(id)}`, options); },
  create(values, options = {}) { return apiRequest('/screenings', { ...options, method: 'POST', body: values }); },
};
