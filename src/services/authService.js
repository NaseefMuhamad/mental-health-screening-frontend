import { apiRequest, setAccessToken } from './api';
let authVersion = 0;
// PROVISIONAL endpoint names/payloads. Confirm against FastAPI OpenAPI before enabling.
export const authService = {
  async login(credentials, options = {}) {
    const current = ++authVersion;
    setAccessToken(null);
    try {
      const result = await apiRequest('/auth/login', { ...options, method: 'POST', body: credentials });
      if (current !== authVersion) throw new Error('This sign-in request was superseded.');
      if (result?.access_token) setAccessToken(result.access_token);
      const user = result?.user || await authService.me(options);
      if (current !== authVersion) throw new Error('This sign-in request was superseded.');
      if (!user || typeof user !== 'object' || !user.id || !user.role) throw new Error('Expected a user with id and role. Check the backend response mapping.');
      return user;
    } catch (error) { if (current === authVersion) setAccessToken(null); throw error; }
  },
  me(options = {}) { return apiRequest('/auth/me', options); },
  async logout(options = {}) {
    const current = ++authVersion;
    try { await apiRequest('/auth/logout', { ...options, method: 'POST' }); }
    finally { if (current === authVersion) setAccessToken(null); }
  },
};
