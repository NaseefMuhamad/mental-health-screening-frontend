import { useCallback, useState } from 'react';
import useResource from '../hooks/useResource';
import { counsellorService } from '../services/counsellorService';
import { PageHeader, Panel } from './PageSupport';
import { label, date, iso } from './liveFormat';
import { ResourceState, Form, Select, Input, Textarea, Pager } from './LiveSupport';
export default function FollowUps() {
  const [status, setStatus] = useState(''); const [offset, setOffset] = useState(0);
  return <><PageHeader title="Follow-ups" description="Appointments for your assigned cases. Schedule an appointment from the counselling page." /><Panel><Form submit="Apply filter" onSave={async data => { setStatus(data.status); setOffset(0); }}><Select title="Status" name="status" required={false}><option value="">All</option>{['scheduled','completed','cancelled'].map(v => <option key={v} value={v}>{label(v)}</option>)}</Select></Form></Panel><FollowupList key={`${status}:${offset}`} status={status} offset={offset} onPage={setOffset} /></>;
}
function FollowupList({ status, offset, onPage }) {
  const load = useCallback(signal => counsellorService.followups({ status, offset, limit: 20 }, { signal }), [status, offset]); const resource = useResource(load);
  return <ResourceState resource={resource}>{page => <><Panel><Pager page={page} offset={offset} onChange={onPage} />{!page.items.length && <p>No appointments found.</p>}</Panel>{page.items.map(row => <Panel key={row.id + row.status + row.scheduled_for} title={`${date(row.scheduled_for)} · ${label(row.status)}`}><p>{row.reason}</p><p className="my-4"><a href={`#/screenings/details?id=${row.screening_id}`}>View screening {row.screening_id.slice(0,8)}</a></p>{row.status === 'scheduled' ? <div className="live-columns"><Form submit="Complete appointment" onSave={data => counsellorService.complete(row.id, data)} onDone={resource.reload}><Textarea name="outcome" title="Outcome" /></Form><Form submit="Reschedule" onSave={data => counsellorService.reschedule(row.id, { ...data, scheduled_for: iso(data.scheduled_for) })} onDone={resource.reload}><Input name="scheduled_for" title="New date and time (your local time)" type="datetime-local" /><Input name="reason" title="Reason" maxLength={120} /></Form><Form submit="Cancel appointment" onSave={data => counsellorService.cancel(row.id, data)} onDone={resource.reload}><Textarea name="reason" title="Cancellation reason" /></Form></div> : <p className="whitespace-pre-wrap">{row.outcome || row.cancellation_reason}</p>}</Panel>)}</>}</ResourceState>;
}
