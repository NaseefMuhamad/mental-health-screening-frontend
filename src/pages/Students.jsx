import { useState } from 'react';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import { useDemoStore, addStudent } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass, detailLink } from './PageSupport';
export default function Students() {
  const data = useDemoStore();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function register(event) {
    event.preventDefault(); setError(''); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(values)) values[key] = values[key].trim();
    if (!values.id || !values.name || !values.department || !values.institution) { setError('Complete the required fields with nonblank values.'); return; }
    try { addStudent({ ...values, age: Number(values.age) }); form.reset(); setMessage('Fictional student added to this demo session.'); } catch (err) { setError(err.message); }
  }
  const columns = [
    { key: 'name', label: 'Student', render: row => <a className="text-blue-700 underline" href={detailLink('students', row.id)}>{row.name}</a> },
    { key: 'id', label: 'Student ID' }, { key: 'department', label: 'Department' }, { key: 'year', label: 'Academic year' }, { key: 'institution', label: 'Institution' },
  ];
  const rows = data.students.filter(row => Object.values(row).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <><PageHeader title="Students" description="Find a fictional student or register a sample record."/><DemoNotice/><div className="mb-6"><Panel title="Register a demo student"><form onSubmit={register}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Field label="Student ID *"><input name="id" required maxLength={50} className={inputClass}/></Field><Field label="Display name *"><input name="name" required maxLength={100} className={inputClass}/></Field><Field label="Age (years) *"><input name="age" type="number" min="1" max="120" step="1" required className={inputClass}/></Field><Field label="Department / course *"><input name="department" required maxLength={100} className={inputClass}/></Field><Field label="Academic year *"><select name="year" className={inputClass} required><option value="">Select year</option>{[1,2,3,4,5,6].map(year => <option key={year}>{year}</option>)}</select></Field><Field label="Institution *"><input name="institution" required maxLength={120} className={inputClass}/></Field></div><button className="primary-button mt-5" type="submit">Add demo student</button><Feedback error={error} message={message}/></form></Panel></div><section className="panel"><div className="panel-heading"><h2>Student directory</h2><SearchBar value={query} onChange={setQuery}/></div><DataTable columns={columns} rows={rows} caption="Fictional students" emptyMessage="No students match your search."/></section></>;
}
