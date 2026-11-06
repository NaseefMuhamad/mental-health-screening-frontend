import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authState';
import { authService } from '../services/authService';
import { getAccessToken, setAccessToken } from '../services/api';
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [restoring, setRestoring] = useState(() => Boolean(getAccessToken()));
  const [restoreError, setRestoreError] = useState('');
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const retryRestore = useCallback(() => {
    setRestoreError(''); setRestoring(true); setRestoreAttempt(value => value + 1);
  }, []);
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const controller = new AbortController();
    let active = true;
    authService.me({ signal: controller.signal }).then(value => {
      if (active && getAccessToken() === token) setUser(value);
    }).catch(cause => {
      if (!active || controller.signal.aborted) return;
      if (cause.status === 401) {
        setAccessToken(null); setUser(null); setError('Your session ended. Please sign in again.');
      } else { setRestoreError(cause.message); }
    }).finally(() => { if (active) setRestoring(false); });
    return () => { active = false; controller.abort(); };
  }, [restoreAttempt]);
  const login = useCallback(async credentials => {
    setLoading(true); setError('');
    try { const value = await authService.login(credentials); setUser(value); return value; }
    finally { setLoading(false); }
  }, []);
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null); setError('');
    window.location.hash = '/login';
  }, []);
  useEffect(() => {
    const expire = () => { setUser(null); setAccessToken(null); setError('Your session ended. Please sign in again.'); setRestoreError(''); setRestoring(false); };
    window.addEventListener('session-expired', expire);
    return () => window.removeEventListener('session-expired', expire);
  }, []);
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let active = true;
    const refresh = () => {
      if (document.visibilityState !== 'visible' || !getAccessToken()) return;
      authService.me().then(value => { if (active) setUser(value); }).catch(() => {});
    };
    const timer = setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [userId]);
  const value = useMemo(() => ({ user, loading, error, restoring, restoreError, retryRestore, login, logout, isAuthenticated: Boolean(user), apiEnabled: true }), [user, loading, error, restoring, restoreError, retryRestore, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
