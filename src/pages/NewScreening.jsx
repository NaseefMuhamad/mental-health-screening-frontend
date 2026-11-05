import { useState } from 'react';
import { useDemoStore, addScreening, sampleDate } from './demoStore';
import { PageHeader, DemoNotice, Panel, Field, Feedback, inputClass, routeParam, detailLink } from './PageSupport';
export default function NewScreening({ studentId = routeParam('studentId') }) {
  const data = useDemoStore();
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState('');
  function submit(event) {
    event.preventDefault(); setError(''); setSavedId('');
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const number = value => value === '' ? null : Number(value);
    const values = { studentId: raw.studentId, date: raw.date, heartRate: number(raw.heartRate), systolic: number(raw.systolic), diastolic: number(raw.diastolic), pupilDiameter: number(raw.pupilDiameter) };
    if (!values.heartRate || Object.values(values).some(value => typeof value === 'number' && (!Number.isFinite(value) || value <= 0))) { setError('Measurements must be positive numbers.'); return; }
    if ((values.systolic === null) !== (values.diastolic === null)) { setError('Enter both blood pressure values or leave both blank.'); return; }
    if (values.systolic !== null && values.systolic <= values.diastolic) { setError('Systolic pressure must exceed diastolic pressure. Check the entered values.'); return; }
    try { const id = addScreening(values); form.reset(); setSavedId(id); } catch (err) { setError(err.message); }
  }
  return <><PageHeader title="New screening" description="Create a separate sample session without overwriting previous measurements."/><DemoNotice/><Panel title="Screening measurements"><form onSubmit={submit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Student *"><select name="studentId" required defaultValue={studentId} className={inputClass}><option value="">Select a student</option>{data.students.map(student => <option value={student.id} key={student.id}>{student.name} · {student.id}</option>)}</select></Field><Field label="Screening date *"><input name="date" type="date" required defaultValue={sampleDate} className={inputClass}/></Field><Field label="Heart rate (beats/min) *"><input name="heartRate" type="number" min="1" step="1" required className={inputClass}/></Field><Field label="Pupil diameter (mm), optional"><input name="pupilDiameter" type="number" min="0.01" step="0.01" className={inputClass}/></Field><Field label="Systolic pressure (mmHg), optional"><input name="systolic" type="number" min="1" step="1" className={inputClass}/></Field><Field label="Diastolic pressure (mmHg), optional"><input name="diastolic" type="number" min="1" step="1" className={inputClass}/></Field></div><p className="mt-5 text-sm leading-7 text-slate-500">These are proposed data-entry fields, not confirmed model inputs. Blood pressure and pupil measurements are optional. Caffeine testing is deferred. No clinical ranges or prediction rules are implemented.</p><button type="submit" disabled={!data.students.length} className="primary-button mt-5 disabled:opacity-50">Save demo screening</button><Feedback error={error} message={savedId ? 'Sample session saved in memory. No model prediction was requested.' : ''}/>{savedId && <a className="mt-4 inline-block text-blue-700 underline" href={detailLink('screenings', savedId)}>View saved demo session</a>}</form></Panel></>;
}
