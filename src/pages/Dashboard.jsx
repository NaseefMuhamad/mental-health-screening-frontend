import useAuth from '../hooks/useAuth';
import CounsellorQueue from '../components/CounsellorQueue';
import { useCallback } from 'react';
import { ClipboardCheck, Clock3, CalendarCheck, ClipboardList } from 'lucide-react';
import useResource from '../hooks/useResource';
import { request } from '../services/api';
import { screeningService } from '../services/screeningService';
import ScreeningActivityChart from '../components/ScreeningActivityChart';
import StatCard from '../components/StatCard';
import { PageHeader, Panel } from './PageSupport';
import { label, date } from './liveFormat';
import { ResourceState, Table } from './LiveSupport';
export default function Dashboard() {
  const { user } = useAuth();
  const load = useCallback(async signal => {
    const [summary, activityResult, recent] = await Promise.all([
      request('/reports/summary', { signal }), request('/reports/activity', { signal }),
      user.role === 'counsellor' ? Promise.resolve(null) : screeningService.list({ limit: 10 }, { signal }),
    ]);
    const activity = activityResult.items.map(item => ({ ...item, day: new Date(item.day + 'T12:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }) }));
    return { summary, recent, activity };
  }, [user.role]); const resource = useResource(load);
  return <><PageHeader title="Dashboard" description="Current operational records from your backend." /><ResourceState resource={resource}>{({ summary: s, recent, activity }) => <><p className="mb-5 text-sm text-slate-500">Scope: {label(s.scope)} · Updated {date(s.generated_at)} <button className="secondary-button ml-3" onClick={resource.reload}>Refresh</button></p><section className="stats-grid"><StatCard label="Screening sessions" value={s.screening_sessions} description="Within your access scope" icon={ClipboardList} /><StatCard label="Awaiting review" value={s.awaiting_review} description="Submitted screening sessions" icon={Clock3} tone="amber" /><StatCard label="Reviewed" value={s.reviewed} description="Human review recorded" icon={ClipboardCheck} tone="green" /><StatCard label="Scheduled follow-ups" value={s.scheduled_followups} description="Within your access scope" icon={CalendarCheck} /></section>{user.role === 'counsellor' ? <CounsellorQueue /> : <Panel title="Recent screening records"><Table headers={['Student', 'Screened', 'Progress', 'Prediction']} rows={recent.items} render={r => <><td><a href={`#/screenings/details?id=${r.id}`}>{r.student_name || r.id.slice(0,8)}</a><small className="block">{r.student_code}</small></td><td>{date(r.measured_at)}</td><td>{label(r.review_status)}</td><td>{label(r.prediction_status)}</td></>} /></Panel>}<ScreeningActivityChart data={activity} /><Panel title="Review progress"><dl className="live-details">{['draft','awaiting_review','in_review','reviewed'].map(v => <div key={v}><dt>{label(v)}</dt><dd>{s[v]}</dd></div>)}</dl></Panel></>}</ResourceState></>;
}
