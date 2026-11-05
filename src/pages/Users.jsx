import { useState } from 'react';
import DataTable from '../components/DataTable';
import { useDemoStore, addUser, setUserRole, roleOptions } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass } from './PageSupport';
export default function Users() {
  const data = useDemoStore();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault(); setError(''); setMessage('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)); values.name = values.name.trim(); values.email = values.email.trim();
    if (!values.name) { setError('Enter a nonblank demo name.'); return; }
    try { addUser(values); form.reset(); setMessage('Demo user listed. No account or credentials were created.'); } catch (err) { setError(err.message); }
  }
  const columns = [{key:'name',label:'Demo name'},{key:'email',label:'Demo email'},{key:'role',label:'Role',render:row => <label><span className="sr-only">Role for {row.name}</span><select value={row.role} onChange={event => {setUserRole(row.id,event.target.value);setMessage('Demo role updated. No real permissions changed.');}}>{roleOptions.map(role => <option key={role}>{role}</option>)}</select></label>}];
  return <><PageHeader title="Users" description="Administrator interface demonstration. No real accounts or permissions."/><DemoNotice/><div className="mb-6"><Panel title="Add a fictional user"><form onSubmit={submit}><div className="grid gap-4 sm:grid-cols-3"><Field label="Demo name *"><input name="name" required maxLength={100} className={inputClass}/></Field><Field label="Demo email *"><input name="email" type="email" placeholder="person@example.test" required maxLength={150} className={inputClass}/></Field><Field label="Role *"><select name="role" className={inputClass}>{roleOptions.map(role => <option key={role}>{role}</option>)}</select></Field></div><button className="primary-button mt-5" type="submit">Add demo user</button><Feedback error={error} message={message}/></form></Panel></div><section className="panel"><div className="panel-heading"><h2>Demo users</h2></div><DataTable columns={columns} rows={data.users} caption="Fictional user accounts"/></section></>;
}

