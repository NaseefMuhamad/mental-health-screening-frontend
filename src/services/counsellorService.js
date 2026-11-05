import { apiRequest } from './api';
// PROVISIONAL routes; sensitive notes must be protected by the backend.
export const counsellorService = {
  listRecords(query = {}, options = {}) { return apiRequest('/counselling', { ...options, query }); },
  createRecord(values, options = {}) { return apiRequest('/counselling', { ...options, method: 'POST', body: values }); },
  listFollowups(query = {}, options = {}) { return apiRequest('/followups', { ...options, query }); },
  createFollowup(values, options = {}) { return apiRequest('/followups', { ...options, method: 'POST', body: values }); },
  updateFollowup(id, values, options = {}) { return apiRequest(`/followups/${encodeURIComponent(id)}`, { ...options, method: 'PATCH', body: values }); },
};
