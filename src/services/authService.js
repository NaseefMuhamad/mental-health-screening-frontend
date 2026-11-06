import { request, setAccessToken } from './api';
export const authService = {
  async login(credentials) {
    const result = await request('/auth/login', { method: 'POST', body: credentials, authenticated: false });
    setAccessToken(result.access_token);
    return result.user;
  },
  me: options => request('/auth/me', options),
  async logout() { await request('/auth/logout', { method: 'POST' }); setAccessToken(null); },
  acceptInvitation: body => request('/auth/invitations/accept', { method: 'POST', body, authenticated: false }),
};
