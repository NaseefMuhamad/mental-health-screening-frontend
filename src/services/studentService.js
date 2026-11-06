import { request, queryString } from './api';
export const studentService = {
  list: (params, options) => request('/students' + queryString(params), options),
  get: (id, options) => request(`/students/${encodeURIComponent(id)}`, options),
  create: body => request('/students', { method: 'POST', body }),
  update: (id, body) => request(`/students/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
};
