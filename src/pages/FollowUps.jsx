import { useState } from 'react';
import DataTable from '../components/DataTable';
import { useDemoStore, addFollowup, completeFollowup, sampleDate } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass } from './PageSupport';
export default function FollowUps() {
  const data = useDemoStore();
  const [filter, setFilter] = useState('Scheduled');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault(); setError(''); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)); values.reason = values.reason.trim();
    if (!values.reason) { setError('Enter a nonblank reason.'); return; }
    try { addFollowup(values); form.reset(); setMessage('Demo follow-up scheduled in memory.'); } catch (err) { setError(err.message); }
  }
  const columns = [{key:'studentId',label:'Student ID'},{key:'screeningId',label:'Screening'},{key:'dueDate',label:'Due date'},{key:'reason',label:'Reason'},{key:'status',label:'Status'},
    {key:'action',label:'Action',render:row => row.status === 'Scheduled' ? <button className="text-blue-700 underline" onClick={() => { completeFollowup(row.id); setMessage('Demo follow-up marked completed.'); }}>Mark completed<span className="sr-only"> {row.id}</span></button> : 'Completed'}];
  const rows = data.followups.filter(item => filter === 'All' || (filter === 'Due' ? item.status === 'Scheduled' && item.dueDate <= sampleDate : item.status === filter));
  return <><PageHeader title="Follow-ups" description={`Due dates are compared with the fixed sample date: ${sampleDate}.`}/><DemoNotice/><div className="mb-6"><Panel title="Schedule a demo follow-up"><form onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Screening session *"><select name="screeningId" required className={inputClass}><option value="">Select a session</option>{data.screenings.map(item => <option key={item.id} value={item.id}>{item.id} · {item.studentId}</option>)}</select></Field><Field label="Due date *"><input name="dueDate" type="date" required defaultValue={sampleDate} className={inputClass}/></Field><Field label="Reason *"><input name="reason" required maxLength={200} className={inputClass}/></Field></div><button className="primary-button mt-5" type="submit">Schedule demo follow-up</button><Feedback error={error} message={message}/></form></Panel></div><section className="panel"><div className="panel-heading"><h2>Follow-up records</h2><label><span className="sr-only">Filter follow-ups</span><select value={filter} onChange={event => setFilter(event.target.value)}>{['Scheduled','Due','Completed','All'].map(value => <option key={value}>{value}</option>)}</select></label></div><DataTable columns={columns} rows={rows} caption="Fictional follow-up appointments" emptyMessage="No follow-ups match this filter."/></section></>;
}
