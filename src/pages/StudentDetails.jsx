import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { useDemoStore } from './demoStore';
import { PageHeader, DemoNotice, Panel, MissingRecord, routeParam, detailLink } from './PageSupport';
export default function StudentDetails({ studentId = routeParam('id') }) {
  const data = useDemoStore();
  const student = data.students.find(item => item.id === studentId);
  if (!student) return <MissingRecord type="Student" href="#/students"/>;
  const rows = data.screenings.filter(item => item.studentId === student.id);
  const columns = [
    { key: 'id', label: 'Session', render: row => <a className="text-blue-700 underline" href={detailLink('screenings', row.id)}>{row.id}</a> },
    { key: 'date', label: 'Date' }, { key: 'status', label: 'Workflow status', render: row => <StatusBadge status={row.status}/> },
  ];
  return <><PageHeader title={student.name} description={student.id}><a className="primary-button inline-flex" href={`#/screenings/new?studentId=${encodeURIComponent(student.id)}`}>New screening</a></PageHeader><DemoNotice/><div className="mb-6"><Panel title="Student information"><dl className="grid gap-5 sm:grid-cols-2">{[['Age',student.age],['Department',student.department],['Academic year',student.year],['Institution',student.institution]].map(([label,value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl></Panel></div><section className="panel"><div className="panel-heading"><div><h2>Screening history</h2><p>Every session retains its own measurements.</p></div></div><DataTable columns={columns} rows={rows} caption="Student screening history" emptyMessage="No screening sessions yet."/></section></>;
}
