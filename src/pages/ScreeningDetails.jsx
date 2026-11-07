import ScreeningQuestions from '../components/ScreeningQuestions';
import { useCallback, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useResource from '../hooks/useResource';
import { allPages } from '../services/api';
import { screeningService } from '../services/screeningService';
import { studentService } from '../services/studentService';
import { counsellorService } from '../services/counsellorService';
import { PageHeader, Panel } from './PageSupport';
import { label, date } from './liveFormat';
import { ResourceState, Action, Form, Select, Textarea } from './LiveSupport';
export default function ScreeningDetails({ screeningId }) {
  const { user } = useAuth();
  const load = useCallback(async signal => {
    const screening = await screeningService.get(screeningId, { signal });
    const student = await studentService.get(screening.student_id, { signal });
    return { screening, student };
  }, [screeningId]); const resource = useResource(load);
  if (!screeningId) return <p>Choose a screening from the records list.</p>;
  return <ResourceState resource={resource}>{({ screening: s, student }) => <><PageHeader title={`Screening for ${student.name}`} description={`${student.student_code} · ${date(s.measured_at)}`} /><Panel title="Screening details"><dl className="live-details"><div><dt>Screening ID</dt><dd>{s.id}</dd></div><div><dt>Review status</dt><dd>{label(s.review_status)}</dd></div><div><dt>Prediction status</dt><dd>{label(s.prediction_status)}</dd></div><div><dt>Counsellor handling this case</dt><dd>{s.assigned_counsellor_name || 'Not taken yet'}</dd></div>{user.role !== 'administrator' && <><div><dt>Heart rate</dt><dd>{s.measurements.heart_rate_bpm} bpm</dd></div></>}</dl>{user.role === 'screening_personnel' && s.review_status === 'draft' && <DraftAnswers screeningId={s.id} onChanged={resource.reload} />}{user.role === 'screening_personnel' && s.review_status !== 'draft' && <div className="my-5"><p role="status">Screening submitted to the counsellor dashboard. {s.prediction_status === 'available' ? 'Predictions are ready for counsellor review.' : 'Answers are saved. Prediction is pending: the ML service may be unavailable or inputs may be outside the demo model range.'}</p>{s.prediction_status !== 'available' && <Action onClick={() => screeningService.retryPrediction(s.id)} onDone={resource.reload}>Retry prediction</Action>}</div>}{user.role === 'counsellor' && (!s.assigned_counsellor_id || s.assigned_counsellor_id === user.id) && s.review_status === 'awaiting_review' && <Action onClick={() => screeningService.beginReview(s.id)} onDone={resource.reload}>{s.assigned_counsellor_id ? 'Begin counselling' : 'Take case and begin counselling'}</Action>}{user.role === 'counsellor' && s.assigned_counsellor_id === user.id && ['in_review','reviewed'].includes(s.review_status) && <p><a href={`#/counselling?screeningId=${s.id}`}>Record counselling and view review history</a></p>}{user.role === 'counsellor' && s.assigned_counsellor_id !== user.id && <p className="my-4">{s.assigned_counsellor_id ? 'Another counsellor is handling this case. You can view its screening results; an administrator can transfer responsibility if needed.' : 'This case is open. Take it when you are ready to begin counselling.'}</p>}{user.role === 'counsellor' && <AssessmentAndPrediction key={s.assigned_counsellor_id} screening={s} onChanged={resource.reload} />}</Panel>{user.role === 'administrator' && s.assigned_counsellor_id && s.review_status !== 'draft' && <Assignment key={s.assigned_counsellor_id || 'none'} screening={s} onDone={resource.reload} />}</>}</ResourceState>;
}
function Assignment({ screening, onDone }) {
  const load = useCallback(signal => allPages('/users', { signal }), []); const resource = useResource(load);
  return <ResourceState resource={resource}>{users => <Panel title="Transfer case responsibility"><p className="mb-4">Counsellors can take open cases directly. Use this control only when responsibility needs to move to another counsellor.</p><Form onSave={data => screeningService.handover(screening.id, data)} onDone={onDone}><Select name="assigned_counsellor_id" title="Active counsellor" defaultValue=""><option value="" disabled>Choose counsellor</option>{users.filter(u => u.is_active && u.role === 'counsellor' && u.id !== screening.assigned_counsellor_id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select><Textarea title="Reason for transfer" name="reason" /></Form></Panel>}</ResourceState>;
}


function DraftAnswers({ screeningId, onChanged }) {
  const load = useCallback(signal => counsellorService.assessment(screeningId, { signal }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{assessment => <Form key={assessment?.id || 'new'} submit="Save answers and submit screening" secondarySubmit="Save draft answers only" onSave={async (data, action) => {
    await counsellorService.saveAssessment(screeningId, Object.fromEntries(Object.entries(data).map(([key,value]) => [key, Number(value)])));
    if (action !== 'secondary') return screeningService.submit(screeningId);
  }} onDone={() => { resource.reload(); onChanged(); }}><ScreeningQuestions inputs={assessment?.inputs || {}} /></Form>}</ResourceState>;
}
function AssessmentAndPrediction({ screening, onChanged }) {
  const { user } = useAuth(); const [revision, setRevision] = useState(0);
  const assigned = screening.assigned_counsellor_id === user.id;
  return <div className="mt-5"><h2>Stress and anxiety estimates</h2><p className="my-4">Screening personnel collect the inputs and submission runs prediction. Your role is to review these demo estimates, assess the student, and record counselling. These categories are not diagnoses.</p>{assigned && <CollectedAnswers screeningId={screening.id} />}<PredictionResult key={revision} screeningId={screening.id} assigned={assigned} onChanged={() => { setRevision(v => v + 1); onChanged(); }} /></div>;
}
function CollectedAnswers({ screeningId }) {
  const load = useCallback(signal => counsellorService.assessment(screeningId, { signal }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{assessment => assessment ? <div className="my-5"><h3>Screening answers to verify</h3><dl className="live-details">{Object.entries(assessment.inputs).map(([key,value]) => <div key={key}><dt>{label(key)}</dt><dd>{value}</dd></div>)}</dl><p>Recorded {date(assessment.created_at)}. Preserve this snapshot; record your professional findings in the counselling record.</p></div> : <p>No contextual answers were collected for this older screening. A complete new screening is required before prediction.</p>}</ResourceState>;
}
function PredictionResult({ screeningId, assigned, onChanged }) {
  const load = useCallback(signal => counsellorService.prediction(screeningId, { signal }), [screeningId]); const resource = useResource(load);
  return <ResourceState resource={resource}>{prediction => <div className="my-5">{prediction.status === 'available' ? <><dl className="live-details"><div><dt>Predicted stress category</dt><dd>{prediction.stress_level}</dd></div><div><dt>Predicted anxiety category</dt><dd>{prediction.anxiety_level}</dd></div></dl><p>Model: {prediction.model_version} · Generated {date(prediction.generated_at)}</p></> : <strong>Prediction: {label(prediction.status)}</strong>}<p className="my-4">{prediction.message}</p>{assigned && prediction.status !== 'available' && <Action onClick={() => counsellorService.requestPrediction(screeningId)} onDone={() => { resource.reload(); onChanged(); }}>Retry prediction</Action>}</div>}</ResourceState>;
}
