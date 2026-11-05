import { useState } from 'react';
import { roleOptions } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass } from './PageSupport';
// onPreview receives a role string. It must not establish a real authenticated session.
export default function Login({ onPreview }) {
  const [role, setRole] = useState(roleOptions[0]);
  const [message, setMessage] = useState('');
  function preview(event) {
    event.preventDefault();
    if (onPreview) onPreview(role);
    else setMessage(`Selected ${role} for preview. Role-based layouts and authentication will be wired later.`);
  }
  return <div className="mx-auto max-w-xl"><PageHeader title="Workspace access" description="Authentication integration is pending."/><DemoNotice/><Panel title="Preview a user role"><p className="mb-5 text-sm leading-7 text-slate-600">This screen does not sign you in. Real login will be connected to the backend authentication service. Do not enter passwords here.</p><form onSubmit={preview}><Field label="Preview role"><select value={role} onChange={event => setRole(event.target.value)} className={inputClass}>{roleOptions.map(item => <option key={item}>{item}</option>)}</select></Field><button className="primary-button mt-5" type="submit">Select preview role</button><Feedback message={message}/></form><a href="#/dashboard" className="mt-6 inline-block text-blue-700 underline">Explore the fictional dashboard</a></Panel></div>;
}
