import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { apiBaseUrl } from '../services/api';
import { inputClass } from './pageUtils';
import { Panel, Field, Feedback } from './PageSupport';
export default function Login() {
  const { login, loading, error: sessionError } = useAuth();
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setError('');
    const form = new FormData(event.currentTarget);
    try { await login({ email: form.get('email').trim(), password: form.get('password') }); window.location.hash = '/dashboard'; }
    catch (cause) { setError(cause.message); }
  }
  return <Panel title="Staff sign in"><p className="mb-5">Use your administrator or activated staff account.</p><form onSubmit={submit} className="live-form"><Field label="Email"><input className={inputClass} type="email" name="email" autoComplete="username" required maxLength={254} /></Field><Field label="Password"><input className={inputClass} type="password" name="password" autoComplete="current-password" required maxLength={1024} /></Field><button className="primary-button" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button><Feedback error={error || sessionError} /></form><p className="mt-5"><a href="#/accept-invitation">Have a staff invitation? Activate your account</a></p><p className="mt-5 text-xs text-slate-500">Backend: {apiBaseUrl}</p></Panel>;
}
