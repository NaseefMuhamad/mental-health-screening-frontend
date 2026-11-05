import { useState } from 'react';
import DataTable from '../components/DataTable';
import { useDemoStore, addCounselling, sampleDate } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass, routeParam } from './PageSupport';
const actions = ['Counselling session scheduled', 'Further assessment recommended', 'Referral made', 'Follow-up required', 'No immediate action required'];
export default function Counselling({ screeningId = routeParam('screeningId') }) {
  const data = useDemoStore();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault(); setError(''); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    values.notes = values.notes.trim();
    try { addCounselling(values); form.reset(); setMessage('Demo review recorded. Schedule any appointment separately on Follow-ups.'); } catch (err) { setError(err.message); }
  }
  const columns = [{key:'screeningId',label:'Screening'},{key:'action',label:'Action'},{key:'date',label:'Review date'}];
  return <><PageHeader title="Counselling" description="Review fictional sessions and record sample actions."/><DemoNotice/><div className="mb-6"><Panel title="Record a demo review"><p className="mb-5 text-sm leading-7 text-slate-500">No model predictions or priority rankings are available. Use fictional notes only. Sensitive note access will require backend permissions.</p><form onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Screening session *"><select name="screeningId" required defaultValue={screeningId} className={inputClass}><option value="">Select a session</option>{data.screenings.map(item => <option key={item.id} value={item.id}>{item.id} · {item.studentId} · {item.status}</option>)}</select></Field><Field label="Review date *"><input name="date" type="date" defaultValue={sampleDate} required className={inputClass}/></Field><Field label="Action *"><select name="action" required className={inputClass}>{actions.map(action => <option key={action}>{action}</option>)}</select></Field></div><div className="mt-4"><Field label="Fictional counselling note (optional)"><textarea name="notes" rows={4} maxLength={2000} className={inputClass}/></Field></div><button type="submit" className="primary-button mt-5">Save demo review</button><a className="ml-4 inline-block text-blue-700 underline" href="#/follow-ups">Schedule a follow-up</a><Feedback error={error} message={message}/></form></Panel></div><section className="panel"><div className="panel-heading"><h2>Recorded demo actions</h2></div><DataTable columns={columns} rows={data.counselling} caption="Demo counselling actions"/></section></>;
}
