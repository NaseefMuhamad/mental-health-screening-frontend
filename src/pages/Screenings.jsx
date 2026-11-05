import { useState } from 'react';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import { useDemoStore, recordRows } from './demoStore';
import { PageHeader, DemoNotice, detailLink } from './PageSupport';
export default function Screenings({ query = '' }) {
  const data = useDemoStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All statuses');
  const terms = [query, search].map(term => term.trim().toLowerCase()).filter(Boolean);
  const rows = recordRows(data).filter(row => (status === 'All statuses' || row.status === status) && terms.every(term => Object.values(row).join(' ').toLowerCase().includes(term)));
  const columns = [
    { key: 'id', label: 'Screening', render: row => <a className="text-blue-700 underline" href={detailLink('screenings', row.id)}>{row.id}</a> },
    { key: 'student', label: 'Student' }, { key: 'date', label: 'Date' },
    { key: 'status', label: 'Workflow status', render: row => <StatusBadge status={row.status}/> },
    { key: 'counsellor', label: 'Counsellor' },
  ];
  return <><PageHeader title="Screening records" description="Browse all sessions in the fictional workspace."><a className="primary-button inline-flex" href="#/screenings/new">New screening</a></PageHeader><DemoNotice/><section className="panel"><div className="panel-heading"><SearchBar value={search} onChange={setSearch}/><label><span className="sr-only">Filter workflow status</span><select value={status} onChange={event => setStatus(event.target.value)}>{['All statuses','Awaiting review','Reviewed','Follow-up scheduled'].map(value => <option key={value}>{value}</option>)}</select></label></div><DataTable columns={columns} rows={rows} caption="All sample screening sessions" emptyMessage="No sessions match your filters."/><p className="table-footer" aria-live="polite">Showing {rows.length} of {data.screenings.length} sessions</p></section></>;
}
