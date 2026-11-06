import { useCallback, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useResource from '../hooks/useResource';
import { allPages } from '../services/api';
import { screeningService } from '../services/screeningService';
import { studentService } from '../services/studentService';
import { counsellorService } from '../services/counsellorService';
import { PageHeader, Panel } from './PageSupport';
import { label, date } from './liveFormat';
import { ResourceState, Action, Form, Select, Textarea, Input } from './LiveSupport';
export default function ScreeningDetails({ screeningId }) {
  const { user } = useAuth();
  const load = useCallback(async signal => {
    const screening = await screeningService.get(screeningId, { signal });
    const student = await studentService.get(screening.student_id, { signal });
    return { screening, student };
  }, [screeningId]); const resource = useResource(load);
  if (!screeningId) return <p>Choose a screening from the records list.</p>;
  return <ResourceState resource={resource}>{({ screening: s, student }) => <><PageHeader title={`Screening for ${student.name}`} description={`${student.student_code} · ${date(s.measured_at)}`} /><Panel title="Screening details"><dl className="live-details"><div><dt>Screening ID</dt><dd>{s.id}</dd></div><div><dt>Review status</dt><dd>{label(s.review_status)}</dd></div><div><dt>Prediction status</dt><dd>{label(s.prediction_status)}</dd></div><div><dt>Assigned counsellor</dt><dd>{s.assigned_counsellor_id || 'Not assigned'}</dd></div>{user.role !== 'administrator' && <><div><dt>Heart rate</dt><dd>{s.measurements.heart_rate_bpm} bpm</dd></div></>}</dl>{user.role === 'screening_personnel' && s.review_status === 'draft' && <Action onClick={() => screeningService.submit(s.id)} onDone={resource.reload}>Submit for review</Action>}{user.role === 'counsellor' && s.assigned_counsellor_id === user.id && s.review_status === 'awaiting_review' && <Action onClick={() => screeningService.beginReview(s.id)} onDone={resource.reload}>Begin review</Action>}{user.role === 'counsellor' && s.assigned_counsellor_id === user.id && ['in_review','reviewed'].includes(s.review_status) && <p><a href={`#/counselling?screeningId=${s.id}`}>Record counselling and view review history</a></p>}{user.role === 'counsellor' && s.assigned_counsellor_id !== user.id && <p className="my-4">You can view this screening. Review actions, counselling notes and follow-ups are available to the assigned counsellor.</p>}{user.role === 'counsellor' && <AssessmentAndPrediction key={s.assigned_counsellor_id} screening={s} onChanged={resource.reload} />}</Panel>{user.role === 'administrator' && s.review_status !== 'draft' && <Assignment key={s.assigned_counsellor_id || 'none'} screening={s} onDone={resource.reload} />}</>}</ResourceState>;
}
function Assignment({ screening, onDone }) {
  const load = useCallback(signal => allPages('/users', { signal }), []); const resource = useResource(load);
  const handover = screening.review_status !== 'awaiting_review';
  return <ResourceState resource={resource}>{users => <Panel title={handover ? 'Hand over case' : 'Assign counsellor'}><Form onSave={data => handover ? screeningService.handover(screening.id, data) : screeningService.assign(screening.id, data)} onDone={onDone}><Select name="assigned_counsellor_id" title="Active counsellor" defaultValue=""><option value="" disabled>Choose counsellor</option>{users.filter(u => u.is_active && u.role === 'counsellor' && u.id !== screening.assigned_counsellor_id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select>{handover && <Textarea title="Reason for handover" name="reason" />}</Form></Panel>}</ResourceState>;
}

function AssessmentAndPrediction({ screening, onChanged }) {
  const { user } = useAuth(); const [revision, setRevision] = useState(0);
  const assigned = screening.assigned_counsellor_id === user.id;
  return <div className="mt-5"><h2>Stress and anxiety demo</h2><p className="my-4">These are simulated dataset categories, not diagnoses. Heart rate alone is insufficient. The contextual scales and recording periods are not validated questionnaires.</p>{assigned && ['in_review','reviewed'].includes(screening.review_status) && <AssessmentForm screeningId={screening.id} onSaved={() => { setRevision(v => v + 1); onChanged(); }} />}<PredictionResult key={revision} screeningId={screening.id} assigned={assigned} onChanged={onChanged} /></div>;
}
function AssessmentForm({ screeningId, onSaved }) {
  const load = useCallback(signal => counsellorService.assessment(screeningId, { signal }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{assessment => <><p className="my-4">Use dataset-scale values for this demonstration. Saving creates an input snapshot and makes previous predictions historical. Course and year are copied from the student profile.</p><Form key={assessment?.id || 'new'} submit="Save demo assessment" onSave={data => counsellorService.saveAssessment(screeningId, Object.fromEntries(Object.entries(data).map(([key,value]) => [key, Number(value)])))} onDone={() => { resource.reload(); onSaved(); }}><Input title="Sleep hours (supported demo range 4–9)" name="sleep_hours" type="number" min={4} max={9} step="0.1" defaultValue={assessment?.inputs.Sleep_Hours} /><Input title="Screen time (dataset scale 2–10; period unverified)" name="screen_time" type="number" min={2} max={10} step="0.1" defaultValue={assessment?.inputs.Screen_Time} /><Input title="Assignment load (demo rating 1–9)" name="assignment_load" type="number" min={1} max={9} step={1} defaultValue={assessment?.inputs.Assignment_Load} /><Input title="Exam pressure (demo rating 1–10)" name="exam_pressure" type="number" min={1} max={10} step={1} defaultValue={assessment?.inputs.Exam_Pressure} /><Input title="Social support (demo rating 1–10)" name="social_support" type="number" min={1} max={10} step={1} defaultValue={assessment?.inputs.Social_Support} /></Form></>}</ResourceState>;
}
function PredictionResult({ screeningId, assigned, onChanged }) {
  const load = useCallback(signal => counsellorService.prediction(screeningId, { signal }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{prediction => <div className="my-5">{prediction.status === 'available' ? <><dl className="live-details"><div><dt>Predicted stress category</dt><dd>{prediction.stress_level}</dd></div><div><dt>Predicted anxiety category</dt><dd>{prediction.anxiety_level}</dd></div></dl><p>Model: {prediction.model_version} · Generated {date(prediction.generated_at)}</p></> : <strong>Prediction: {label(prediction.status)}</strong>}<p className="my-4">{prediction.message}</p>{assigned && prediction.status !== 'available' && <Action onClick={() => counsellorService.requestPrediction(screeningId)} onDone={() => { resource.reload(); onChanged(); }}>Generate stress and anxiety estimates</Action>}</div>}</ResourceState>;
}
