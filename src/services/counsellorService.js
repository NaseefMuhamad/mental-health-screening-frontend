import { request, queryString } from './api';
export const counsellorService = {
  assessment: (id, options) => request(`/screenings/${encodeURIComponent(id)}/assessment`, options),
  saveAssessment: (id, body) => request(`/screenings/${encodeURIComponent(id)}/assessment`, { method: 'POST', body }),
  requestPrediction: screening_id => request('/predictions', { method: 'POST', body: { screening_id } }),
  records: (params, options) => request('/counselling' + queryString(params), options),
  record: body => request('/counselling', { method: 'POST', body }),
  followups: (params, options) => request('/followups' + queryString(params), options),
  schedule: body => request('/followups', { method: 'POST', body }),
  reschedule: (id, body) => request(`/followups/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  complete: (id, body) => request(`/followups/${encodeURIComponent(id)}/complete`, { method: 'POST', body }),
  cancel: (id, body) => request(`/followups/${encodeURIComponent(id)}/cancel`, { method: 'POST', body }),
  prediction: (id, options) => request(`/predictions/${encodeURIComponent(id)}`, options),
};
