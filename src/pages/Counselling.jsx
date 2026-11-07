import { useCallback, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useResource from '../hooks/useResource';
import { allPages } from '../services/api';
import { counsellorService } from '../services/counsellorService';
import { PageHeader, Panel } from './PageSupport';
import { label, date, iso, nowLocal } from './liveFormat';
import { ResourceState, Form, Select, Textarea, Input, Table } from './LiveSupport';
export default function Counselling({ screeningId }) {
  const load = useCallback(signal => allPages('/screenings', { signal, assigned_only: true }), []); const resource = useResource(load);
  return <><PageHeader title="Counsellor review" description="All submitted screenings are visible in Screening Records. Take an open case from the dashboard to begin. This page contains your cases and confidential notes." /><ResourceState resource={resource}>{screenings => <CounsellingWorkspace screenings={screenings} screeningId={screeningId} />}</ResourceState></>;
}
function CounsellingWorkspace({ screenings, screeningId }) {
  const [revision, setRevision] = useState(0);
  const { user } = useAuth();
  const assigned = screenings.filter(s => s.assigned_counsellor_id === user.id);
  const choices = assigned.filter(s => ['in_review','reviewed'].includes(s.review_status));
  return <><Panel title="My counselling cases"><Table headers={['Student', 'Screened', 'Progress']} rows={assigned} render={s => <><td><a href={`#/screenings/details?id=${s.id}`}>{s.student_name || s.id.slice(0,8)}</a><small className="block">{s.student_code}</small></td><td>{date(s.measured_at)}</td><td>{label(s.review_status)}</td></>} /></Panel>{choices.length ? <><Panel title="Record review action"><Form onSave={data => counsellorService.record({ ...data, occurred_at: iso(data.occurred_at), notes: data.notes.trim() || null })} onDone={() => setRevision(value => value + 1)}><Select name="screening_id" title="Screening" defaultValue={choices.some(s => s.id === screeningId) ? screeningId : ''}><option value="" disabled>Choose screening</option>{choices.map(s => <option key={s.id} value={s.id}>{s.student_name || s.id.slice(0,8)} — {date(s.measured_at)}</option>)}</Select><Select name="action" title="Review action">{['counselling_scheduled','further_assessment_recommended','referral_made','followup_required','no_immediate_action_required'].map(v => <option key={v} value={v}>{label(v)}</option>)}</Select><Input name="occurred_at" title="Action date and time (your local time)" type="datetime-local" defaultValue={nowLocal()} /><Textarea name="notes" title="Restricted counselling notes (optional)" required={false} /></Form></Panel><Panel title="Schedule follow-up"><Form onSave={data => counsellorService.schedule({ ...data, scheduled_for: iso(data.scheduled_for) })}><Select name="screening_id" title="Screening" defaultValue={choices.some(s => s.id === screeningId) ? screeningId : ''}><option value="" disabled>Choose screening</option>{choices.map(s => <option key={s.id} value={s.id}>{s.student_name || s.id.slice(0,8)} — {s.student_code}</option>)}</Select><Input name="scheduled_for" title="Appointment date and time (your local time)" type="datetime-local" /><Input name="reason" title="Reason" maxLength={120} /></Form></Panel></> : <Panel><p>No cases are currently ready for a review action. Open the dashboard and take a case to begin counselling.</p></Panel>}<History key={revision} screeningId={assigned.some(s => s.id === screeningId) ? screeningId : undefined} /></>;
}
function History({ screeningId }) {
  const load = useCallback(signal => allPages('/counselling', { signal, screening_id: screeningId }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{rows => <Panel title="Counselling records"><button className="secondary-button mb-4" onClick={resource.reload}>Refresh records</button><Table headers={['Student', 'Action', 'Occurred', 'Notes']} rows={rows} render={r => <><td><a href={`#/screenings/details?id=${r.screening_id}`}>{r.student_name || r.screening_id.slice(0,8)}</a><small className="block">{r.student_code}</small></td><td>{label(r.action)}</td><td>{date(r.occurred_at)}</td><td className="whitespace-pre-wrap">{r.notes || '—'}</td></>} /></Panel>}</ResourceState>;
}
