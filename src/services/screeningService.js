import { request, queryString } from './api';
const path = id => `/screenings/${encodeURIComponent(id)}`;
export const screeningService = {
  list: (params, options) => request('/screenings' + queryString(params), options),
  get: (id, options) => request(path(id), options),
  create: body => request('/screenings', { method: 'POST', body }),
  submit: id => request(path(id) + '/submit', { method: 'POST' }),
  assign: (id, body) => request(path(id) + '/assignment', { method: 'PUT', body }),
  beginReview: id => request(path(id) + '/begin-review', { method: 'POST' }),
  handover: (id, body) => request(path(id) + '/handover', { method: 'POST', body }),
};
