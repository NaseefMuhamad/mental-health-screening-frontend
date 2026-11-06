import { request, queryString } from './api';
export const staffService = {
  list: (params, options) => request('/users' + queryString(params), options),
  invite: body => request('/users/invitations', { method: 'POST', body }),
  revoke: id => request(`/users/invitations/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  status: (id, body) => request(`/users/${encodeURIComponent(id)}/status`, { method: 'PATCH', body }),
  role: (id, role) => request(`/users/${encodeURIComponent(id)}/role`, { method: 'PATCH', body: { role } }),
};
