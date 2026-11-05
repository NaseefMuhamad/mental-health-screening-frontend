// FICTIONAL DATA ONLY. Shared in-memory state; refreshing resets every change.
// No API, model, authentication, localStorage or real student information.
import { useSyncExternalStore } from 'react';
export const sampleDate = '2026-11-03';
export const samplePeriod = '28 Oct – 3 Nov 2026';
export const roleOptions = ['Screening Personnel', 'Counsellor', 'Administrator'];
const seed = {
  students: [
    { id: 'DEMO-001', name: 'Demo Student 01', age: 20, department: 'Computing', year: '2', institution: 'Demo Institution' },
    { id: 'DEMO-002', name: 'Demo Student 02', age: 21, department: 'Education', year: '3', institution: 'Demo Institution' },
    { id: 'DEMO-003', name: 'Demo Student 03', age: 19, department: 'Business', year: '1', institution: 'Demo Institution' },
  ],
  screenings: [
    { id: 'SCR-DEMO-004', studentId: 'DEMO-001', date: '2026-11-03', heartRate: 76, systolic: null, diastolic: null, pupilDiameter: null, status: 'Awaiting review', prediction: null, counsellor: 'Unassigned' },
    { id: 'SCR-DEMO-003', studentId: 'DEMO-003', date: '2026-11-02', heartRate: 80, systolic: null, diastolic: null, pupilDiameter: null, status: 'Awaiting review', prediction: null, counsellor: 'Unassigned' },
    { id: 'SCR-DEMO-002', studentId: 'DEMO-002', date: '2026-11-01', heartRate: 72, systolic: null, diastolic: null, pupilDiameter: null, status: 'Follow-up scheduled', prediction: null, counsellor: 'Demo Counsellor' },
    { id: 'SCR-DEMO-001', studentId: 'DEMO-001', date: '2026-10-30', heartRate: 74, systolic: null, diastolic: null, pupilDiameter: null, status: 'Reviewed', prediction: null, counsellor: 'Demo Counsellor' },
  ],
  counselling: [
    { id: 'NOTE-DEMO-001', screeningId: 'SCR-DEMO-001', action: 'No immediate action required', notes: 'Fictional demonstration record.', date: '2026-10-30' },
    { id: 'NOTE-DEMO-002', screeningId: 'SCR-DEMO-002', action: 'Follow-up required', notes: 'Fictional follow-up for interface testing.', date: '2026-11-01' },
  ],
  followups: [{ id: 'FU-DEMO-001', screeningId: 'SCR-DEMO-002', studentId: 'DEMO-002', dueDate: '2026-11-03', reason: 'Demo counselling follow-up', status: 'Scheduled' }],
  users: [
    { id: 'USER-DEMO-001', name: 'Demo Counsellor', email: 'counsellor@example.test', role: 'Counsellor' },
    { id: 'USER-DEMO-002', name: 'Demo Screening Officer', email: 'screening@example.test', role: 'Screening Personnel' },
  ],
};
let state = seed;
let sequence = 100;
const listeners = new Set();
const subscribe = callback => { listeners.add(callback); return () => listeners.delete(callback); };
const snapshot = () => state;
const commit = next => { state = next; listeners.forEach(listener => listener()); };
const id = prefix => `${prefix}-LOCAL-${++sequence}`;
export function useDemoStore() { return useSyncExternalStore(subscribe, snapshot, snapshot); }
export function resetDemo() { commit(seed); }
export function addStudent(student) {
  if (state.students.some(item => item.id.toLowerCase() === student.id.toLowerCase())) throw new Error('That student ID is already in use.');
  commit({ ...state, students: [...state.students, student] });
}
export function addScreening(values) {
  if (!state.students.some(student => student.id === values.studentId)) throw new Error('Select an existing student.');
  const session = { ...values, id: id('SCR'), status: 'Awaiting review', prediction: null, counsellor: 'Unassigned' };
  commit({ ...state, screenings: [session, ...state.screenings] });
  return session.id;
}
export function addCounselling(values) {
  if (!state.screenings.some(item => item.id === values.screeningId)) throw new Error('Select a screening session.');
  const hasFollowup = state.followups.some(item => item.screeningId === values.screeningId && item.status === 'Scheduled');
  commit({ ...state, counselling: [{ ...values, id: id('NOTE') }, ...state.counselling], screenings: state.screenings.map(item => item.id === values.screeningId ? { ...item, status: hasFollowup ? 'Follow-up scheduled' : 'Reviewed', counsellor: 'Demo Counsellor' } : item) });
}
export function addFollowup(values) {
  const session = state.screenings.find(item => item.id === values.screeningId);
  if (!session) throw new Error('Select a screening session.');
  commit({ ...state, followups: [{ ...values, id: id('FU'), studentId: session.studentId, status: 'Scheduled' }, ...state.followups], screenings: state.screenings.map(item => item.id === session.id ? { ...item, status: 'Follow-up scheduled' } : item) });
}
export function completeFollowup(followupId) {
  // Completing an appointment does not claim that a counsellor has reviewed the screening.
  commit({ ...state, followups: state.followups.map(item => item.id === followupId ? { ...item, status: 'Completed' } : item) });
}
export function addUser(values) {
  if (!roleOptions.includes(values.role)) throw new Error('Choose a valid demo role.');
  if (state.users.some(user => user.email.toLowerCase() === values.email.toLowerCase())) throw new Error('That email is already listed.');
  commit({ ...state, users: [...state.users, { ...values, id: id('USER') }] });
}
export function setUserRole(userId, role) {
  if (!roleOptions.includes(role)) return;
  commit({ ...state, users: state.users.map(user => user.id === userId ? { ...user, role } : user) });
}
export function recordRows(data) {
  return data.screenings.map(session => ({ ...session, student: data.students.find(student => student.id === session.studentId)?.name || 'Unknown demo student' }));
}
export function activityRows(data) {
  return ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03'].map(date => ({ day: date.slice(5), screenings: data.screenings.filter(item => item.date === date).length }));
}

