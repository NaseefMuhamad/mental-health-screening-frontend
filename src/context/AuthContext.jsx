import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './authState';
import { authService } from '../services/authService';
import { apiEnabled } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(apiEnabled);
  const [error, setError] = useState('');
  const operation = useRef(0);
  useEffect(() => {
    if (!apiEnabled) return;
    const controller = new AbortController();
    const current = ++operation.current;
    authService.me({ signal: controller.signal })
      .then(value => {
        if (!value?.id || !value.role) throw new Error('Unexpected session response. Check the backend mapping.');
        if (operation.current === current) setUser(value);
      })
      .catch(cause => {
        if (cause.name !== 'AbortError' && operation.current === current && cause.status !== 401) setError(cause.message);
      })
      .finally(() => { if (!controller.signal.aborted && operation.current === current) setLoading(false); });
    return () => controller.abort();
  }, []);

  const login = useCallback(async credentials => {
    if (!apiEnabled) throw new Error('Login is disabled in the demo preview.');
    const current = ++operation.current;
    setLoading(true); setError('');
    try {
      const value = await authService.login(credentials);
      if (operation.current === current) setUser(value);
      return value;
    } catch (cause) {
      if (operation.current === current) { setUser(null); setError(cause.message); }
      throw cause;
    } finally { if (operation.current === current) setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    const current = ++operation.current;
    setUser(null); setError(''); setLoading(true);
    try { if (apiEnabled) await authService.logout(); }
    catch (cause) { if (operation.current === current) setError('Local access cleared, but server logout failed. Retry to end the server session.'); throw cause; }
    finally { if (operation.current === current) setLoading(false); }
  }, []);

  const value = useMemo(() => ({ user, loading, error, login, logout,
    isAuthenticated: Boolean(user), apiEnabled }), [user, loading, error, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
