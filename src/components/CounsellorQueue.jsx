import { useCallback, useEffect, useState } from 'react';
import useResource from '../hooks/useResource';
import { request, queryString } from '../services/api';
import { Panel } from '../pages/PageSupport';
import { ResourceState, Table, Pager } from '../pages/LiveSupport';
import { date, label } from '../pages/liveFormat';

export default function CounsellorQueue() {
  const [assignedOnly, setAssignedOnly] = useState(false);
  const [offset, setOffset] = useState(0);
  return <section aria-label="Counsellor screening results"><div className="live-pager"><button className="secondary-button" aria-pressed={!assignedOnly} onClick={() => { setAssignedOnly(false); setOffset(0); }}>All submitted screenings</button><button className="secondary-button" aria-pressed={assignedOnly} onClick={() => { setAssignedOnly(true); setOffset(0); }}>My cases</button></div><QueueRows key={`${assignedOnly}:${offset}`} assignedOnly={assignedOnly} offset={offset} onPage={setOffset} /></section>;
}

function QueueRows({ assignedOnly, offset, onPage }) {
  const load = useCallback(signal => request('/reports/counsellor-queue' + queryString({ assigned_only: assignedOnly, offset, limit: 20 }), { signal }), [assignedOnly, offset]);
  const resource = useResource(load);
  const reload = resource.reload;
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') reload(); };
    const timer = setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [reload]);
  return <Panel title="Screening results and review queue"><p className="mb-4">All submitted students remain visible, including Low-category results. Estimates are from the simulated dataset; they are not diagnoses.</p><button className="secondary-button mb-4" onClick={reload}>Refresh results</button><ResourceState resource={resource}>{page => <><Table headers={['Student', 'Screened', 'Stress', 'Anxiety', 'Next step', 'Responsibility', 'Open']} rows={page.items} render={row => <><td><a href={`#/students/details?id=${row.student_id}`}>{row.student_name}</a><small className="block">{row.student_code}</small></td><td>{date(row.measured_at)}</td><td>{row.stress_level || 'Not generated'}</td><td>{row.anxiety_level || 'Not generated'}</td><td>{nextStep(row)}{row.generated_at && <small className="block">Generated {date(row.generated_at)}</small>}</td><td>{row.assigned_to_me ? 'You' : row.assigned_counsellor_name || 'Open case'}</td><td><a href={`#/screenings/details?id=${row.id}`}>{row.assigned_to_me ? 'Continue counselling' : !row.assigned_counsellor_id ? 'Open to take case' : 'View screening'}</a></td></>} /><Pager page={page} offset={offset} onChange={onPage} /></>}</ResourceState></Panel>;
}

function nextStep(row) {
  if (row.stress_level && row.anxiety_level) return row.review_status === 'reviewed' ? 'Counselling recorded' : !row.assigned_counsellor_id ? 'Ready — take case to begin counselling' : 'Ready for counselling';
  if (!row.assessment_complete) return 'Screening answers missing';
  if (row.prediction_status === 'failed') return 'Prediction pending retry';
  if (!row.assigned_counsellor_id) return 'Open case — a counsellor can take it';
  if (row.review_status === 'awaiting_review') return 'Begin counselling review';
  return `Prediction pending · ${label(row.review_status)}`;
}
