// API calls are disabled until the real backend contract has been reviewed.
export const apiEnabled = import.meta.env.VITE_ENABLE_API === 'true';
const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
let accessToken = null;
export function setAccessToken(token) { accessToken = token || null; }

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message); this.name = 'ApiError'; this.status = status; this.details = details;
  }
}

export async function apiRequest(path, { method = 'GET', body, query, signal } = {}) {
  if (!apiEnabled) throw new ApiError('Backend integration is disabled. The preview uses fictional data.');
  if (!path.startsWith('/') || path.startsWith('//')) throw new ApiError('API paths must begin with one slash.');
  const url = new URL(`${baseUrl}${path}`);
  if (!['http:', 'https:'].includes(url.protocol)) throw new ApiError('Use an HTTP or HTTPS API URL.');
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  let response;
  try {
    response = await fetch(url, { method, headers, credentials: 'include', signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach the backend. Check its address and connection.');
  }
  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); }
    catch {
      if (response.ok) throw new ApiError('The backend returned an unexpected non-JSON response.', response.status);
    }
  }
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === 'string' ? detail :
      Array.isArray(detail) ? detail.map(item => `${(item.loc || []).join('.')}: ${item.msg || 'Invalid value'}`).join('; ') :
      `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}
