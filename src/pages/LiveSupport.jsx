import { useState } from 'react';
import { inputClass } from './pageUtils';
import { Panel, Field, Feedback } from './PageSupport';
export function ResourceState({ resource, children }) {
  if (resource.loading) return <Panel><p role="status">Loading records…</p></Panel>;
  if (resource.error) return <Panel><p role="alert">{resource.error}</p><button className="secondary-button mt-4" onClick={resource.reload}>Retry</button></Panel>;
  return children(resource.data);
}
export function Form({ onSave, children, submit = 'Save', secondarySubmit, onDone }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  async function save(event) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    setBusy(true); setError(''); setMessage('');
    try { const result = await onSave(data, event.nativeEvent.submitter?.value || 'primary'); setMessage('Saved successfully.'); onDone?.(result, form); }
    catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <form className="live-form" onSubmit={save}><fieldset disabled={busy} className="live-form">{children}<button className="primary-button" type="submit" value="primary">{busy ? 'Saving…' : submit}</button>{secondarySubmit && <button className="secondary-button" type="submit" value="secondary">{secondarySubmit}</button>}</fieldset><Feedback error={error} message={message} /></form>;
}
export function Input({ name, title, type = 'text', required = true, ...props }) {
  return <Field label={title}><input className={inputClass} name={name} type={type} required={required} {...props} /></Field>;
}
export function Select({ name, title, children, ...props }) { return <Field label={title}><select className={inputClass} name={name} required {...props}>{children}</select></Field>; }
export function Textarea({ name, title, required = true, ...props }) { return <Field label={title}><textarea className={inputClass} name={name} rows={3} required={required} maxLength={5000} {...props} /></Field>; }
export function Table({ headers, rows, render }) {
  return <div className="live-table-wrap"><table className="live-table"><thead><tr>{headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id}>{render(row)}</tr>)}</tbody></table>{!rows.length && <p className="p-5">No records found.</p>}</div>;
}
export function Pager({ page, offset, onChange }) {
  return <div className="live-pager"><span>{page.total ? `${offset + 1}–${Math.min(offset + page.items.length, page.total)} of ${page.total}` : '0 records'}</span><button className="secondary-button" disabled={!offset} onClick={() => onChange(Math.max(0, offset - 20))}>Previous</button><button className="secondary-button" disabled={offset + page.items.length >= page.total} onClick={() => onChange(offset + 20)}>Next</button></div>;
}
export function Action({ onClick, children, onDone }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  return <div><button className="secondary-button" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { const result = await onClick(); onDone?.(result); } catch (cause) { setError(cause.message); } finally { setBusy(false); } }}>{busy ? 'Working…' : children}</button><Feedback error={error} /></div>;
}
