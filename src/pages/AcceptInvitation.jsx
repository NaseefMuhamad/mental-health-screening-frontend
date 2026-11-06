import { useState } from 'react';
import { authService } from '../services/authService';
import { inputClass } from './pageUtils';
import { Panel, Field, Feedback } from './PageSupport';
export default function AcceptInvitation() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [done, setDone] = useState(false);
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setError('');
    if (data.get('password') !== data.get('confirm')) { setError('Passwords must match.'); return; }
    setBusy(true);
    try { await authService.acceptInvitation({ token: data.get('token').trim(), password: data.get('password') }); form.reset(); setDone(true); }
    catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <Panel title="Activate staff account">{done ? <p role="status">Account activated. <a href="#/login">Sign in</a> with your email and password.</p> : <form onSubmit={submit} className="live-form"><p>Enter the invitation code supplied privately by your administrator.</p><Field label="Invitation code"><input className={inputClass} name="token" type="password" autoComplete="off" required maxLength={1024} /></Field><Field label="New password (12–128 characters)"><input className={inputClass} type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} required /></Field><Field label="Confirm password"><input className={inputClass} type="password" name="confirm" autoComplete="new-password" minLength={12} maxLength={128} required /></Field><button className="primary-button" disabled={busy}>{busy ? 'Activating…' : 'Activate account'}</button><Feedback error={error} /></form>}<a className="mt-5 inline-block" href="#/login">Back to sign in</a></Panel>;
}
