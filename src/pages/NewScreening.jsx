import { useCallback } from 'react';
import useResource from '../hooks/useResource';
import { allPages } from '../services/api';
import { screeningService } from '../services/screeningService';
import { PageHeader, Panel } from './PageSupport';
import { iso, nowLocal } from './liveFormat';
import { ResourceState, Form, Select, Input } from './LiveSupport';
export default function NewScreening({ studentId }) {
  const load = useCallback(signal => allPages('/students', { signal }), []); const resource = useResource(load);
  return <><PageHeader title="New screening" description="Record measured physiological signals. Saving creates a draft; submit it from its details page." /><ResourceState resource={resource}>{students => <Panel>{!students.length ? <p><a href="#/students">Register a student first.</a></p> : <Form submit="Save draft" onSave={data => {
    const measurements = { heart_rate_bpm: Number(data.heart_rate_bpm) };
    return screeningService.create({ student_id: data.student_id, measured_at: iso(data.measured_at), measurements });
  }} onDone={row => { window.location.hash = `/screenings/details?id=${row.id}`; }}><Select name="student_id" title="Student" defaultValue={studentId || ''}><option value="" disabled>Choose student</option>{students.map(s => <option value={s.id} key={s.id}>{s.student_code} — {s.name}</option>)}</Select><Input name="measured_at" title="Measurement date and time (your local time)" type="datetime-local" defaultValue={nowLocal()} /><Input name="heart_rate_bpm" title="Heart rate (bpm)" type="number" min="0.01" step="any" /></Form>}</Panel>}</ResourceState></>;
}
