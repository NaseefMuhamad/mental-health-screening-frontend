import { useCallback, useState } from 'react';
import useResource from '../hooks/useResource';
import { screeningService } from '../services/screeningService';
import { PageHeader, Panel } from './PageSupport';
import { label, date } from './liveFormat';
import { ResourceState, Table, Pager, Select, Form } from './LiveSupport';
export default function Screenings({ studentId }) {
  const [status, setStatus] = useState(''); const [offset, setOffset] = useState(0);
  return <><PageHeader title="Screening records" description="Counsellors see all submitted screenings regardless of risk. Screening personnel see their own records; administrators see operational progress." /><Panel><Form submit="Apply filter" onSave={async data => { setStatus(data.status); setOffset(0); }}><Select title="Review status" name="status" required={false}><option value="">All statuses</option>{['draft','awaiting_review','in_review','reviewed'].map(v => <option key={v} value={v}>{label(v)}</option>)}</Select></Form></Panel><ScreeningList key={`${status}:${offset}:${studentId}`} studentId={studentId} status={status} offset={offset} onPage={setOffset} /></>;
}
function ScreeningList({ studentId, status, offset, onPage }) {
  const load = useCallback(signal => screeningService.list({ student_id: studentId, review_status: status, offset, limit: 20 }, { signal }), [studentId, status, offset]); const resource = useResource(load);
  return <ResourceState resource={resource}>{page => <Panel><Table headers={['Student', 'Screened', 'Progress', 'Prediction', 'Profile']} rows={page.items} render={row => <><td><a href={`#/screenings/details?id=${row.id}`}>{row.student_name || row.id.slice(0,8)}</a><small className="block">{row.student_code}</small></td><td>{date(row.measured_at)}</td><td>{label(row.review_status)}</td><td>{label(row.prediction_status)}</td><td><a href={`#/students/details?id=${row.student_id}`}>Student profile</a></td></>} /><Pager page={page} offset={offset} onChange={onPage} /></Panel>}</ResourceState>;
}
