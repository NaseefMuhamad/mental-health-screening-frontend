import { useCallback } from 'react';
import useResource from '../hooks/useResource';
import { allPages } from '../services/api';
import { screeningService } from '../services/screeningService';
import ScreeningQuestions from '../components/ScreeningQuestions';
import { PageHeader, Panel } from './PageSupport';
import { iso, nowLocal } from './liveFormat';
import { ResourceState, Form, Select, Input } from './LiveSupport';
export default function NewScreening({ studentId }) {
  const load = useCallback(signal => allPages('/students', { signal }), []); const resource = useResource(load);
  return <><PageHeader title="New screening" description="Record heart rate and ask the five screening questions. Submit to run predictions and send the case to the counsellor dashboard." /><ResourceState resource={resource}>{students => <Panel>{!students.length ? <p><a href="#/students">Register a student first.</a></p> : <Form submit="Submit screening and run prediction" secondarySubmit="Save draft only" onSave={(data, action) => screeningService.create({ student_id: data.student_id, measured_at: iso(data.measured_at), measurements: { heart_rate_bpm: Number(data.heart_rate_bpm) }, assessment: { sleep_hours: Number(data.sleep_hours), screen_time: Number(data.screen_time), assignment_load: Number(data.assignment_load), exam_pressure: Number(data.exam_pressure), social_support: Number(data.social_support) }, submit_for_review: action !== 'secondary' })} onDone={row => { window.location.hash = `/screenings/details?id=${row.id}`; }}><Select name="student_id" title="Student" defaultValue={studentId || ''}><option value="" disabled>Choose student</option>{students.map(s => <option value={s.id} key={s.id}>{s.student_code} — {s.name}</option>)}</Select><Input name="measured_at" title="Measurement date and time (your local time)" type="datetime-local" defaultValue={nowLocal()} /><Input name="heart_rate_bpm" title="Heart rate (bpm)" type="number" min="0.01" step="any" /><p>The demo model supports heart rates 60–114 bpm. Other readings can be saved for human review, but may not receive a model estimate.</p><ScreeningQuestions /></Form>}</Panel>}</ResourceState></>;
}
