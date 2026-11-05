import { useState } from 'react';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
const statuses = ['All statuses', 'Awaiting review', 'Reviewed', 'Follow-up scheduled'];
const columns = [
  { key: 'student', label: 'Student', render: row => <><strong>{row.student}</strong><small>{row.studentId}</small></> },
  { key: 'id', label: 'Record ID' },
  { key: 'date', label: 'Screened on', render: row => <time dateTime={row.date}>{new Date(`${row.date}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</time> },
  { key: 'status', label: 'Workflow status', render: row => <StatusBadge status={row.status} /> },
  { key: 'counsellor', label: 'Assigned counsellor' },
];
export default function RecentRecordsTable({ records = [], query = '' }) {
  const [status, setStatus] = useState('All statuses');
  const filtered = records.filter(row => (status === 'All statuses' || row.status === status) && Object.values(row).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="panel records-panel" aria-labelledby="records-title"><div className="panel-heading"><div><h2 id="records-title">Recent screening records</h2><p>Fictional records · workflow status does not describe a diagnosis</p></div><label><span className="sr-only">Filter by workflow status</span><select value={status} onChange={event => setStatus(event.target.value)}>{statuses.map(value => <option key={value}>{value}</option>)}</select></label></div>
    <DataTable columns={columns} rows={filtered} caption="Sample screening records" emptyMessage="No sample records match your search or filter." />
    <div className="table-footer" aria-live="polite">Showing {filtered.length} of {records.length} sample records<span>Sample data only</span></div>
  </section>;
}
