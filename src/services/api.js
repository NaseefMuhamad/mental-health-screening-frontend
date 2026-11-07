export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
// Per-tab persistence survives refresh without storing passwords or user profiles.
const sessionKey = `screening-session:${apiBaseUrl}`;
function readStoredToken() {
  try { return window.sessionStorage.getItem(sessionKey) || null; }
  catch { return null; }
}
let accessToken = readStoredToken();
export function setAccessToken(value) {
  accessToken = value || null;
  try {
    if (accessToken) window.sessionStorage.setItem(sessionKey, accessToken);
    else window.sessionStorage.removeItem(sessionKey);
  } catch { /* Continue with memory-only access if browser storage is unavailable. */ }
}
export function getAccessToken() { return accessToken; }
export class ApiError extends Error {
  constructor(message, status) { super(message); this.name = 'ApiError'; this.status = status; }
}
export async function request(path, { method = 'GET', body, signal, authenticated = true } = {}) {
  const token = authenticated ? accessToken : null;
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), 20000);
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout.signal]) : timeout.signal,
      cache: 'no-store', credentials: 'omit',
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(timeout.signal.aborted ? 'The backend took too long to respond. Check its terminal before retrying a save.' : `Cannot reach the backend at ${apiBaseUrl}. Check that it is running and allows this frontend address.`, 0);
  } finally { clearTimeout(timer); }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && token && token === accessToken) {
      setAccessToken(null);
      window.dispatchEvent(new Event('session-expired'));
    }
    const detail = data?.detail;
    const message = Array.isArray(detail) ? detail.map(item => `${item.loc?.slice(1).join('.') || 'Input'}: ${item.msg}`).join('; ') : typeof detail === 'string' ? detail : `Request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return data;
}
export function queryString(values = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== '' && value !== undefined && value !== null) params.set(key, String(value));
  return params.size ? `?${params}` : '';
}
export async function allPages(path, { signal, ...filters } = {}) {
  const items = [];
  for (let offset = 0; ; offset += 100) {
    const page = await request(path + queryString({ ...filters, offset, limit: 100 }), { signal });
    items.push(...page.items);
    if (!page.items.length || items.length >= page.total) return items;
  }
}
