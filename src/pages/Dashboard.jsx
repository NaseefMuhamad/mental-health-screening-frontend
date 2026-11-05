import { Users, ClipboardCheck, Clock3, CalendarCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import ScreeningActivityChart from '../components/ScreeningActivityChart';
import RecentRecordsTable from '../components/RecentRecordsTable';
import { useDemoStore, recordRows, activityRows, sampleDate, samplePeriod } from './demoStore';
import { PageHeader, DemoNotice, Panel } from './PageSupport';
export default function Dashboard({ query = '' }) {
  const data = useDemoStore();
  const activity = activityRows(data);
  const pending = data.screenings.filter(item => item.status === 'Awaiting review').length;
  const due = data.followups.filter(item => item.status === 'Scheduled' && item.dueDate <= sampleDate).length;
  const stats = [
    { label: 'Registered students', value: data.students.length, description: 'All fictional student records', icon: Users },
    { label: 'Screenings in sample week', value: activity.reduce((sum, day) => sum + day.screenings, 0), description: samplePeriod, icon: ClipboardCheck, tone: 'teal' },
    { label: 'Awaiting review', value: pending, description: 'All sample screening sessions', icon: Clock3, tone: 'amber' },
    { label: 'Follow-ups due', value: due, description: `Scheduled on or before ${sampleDate}`, icon: CalendarCheck, tone: 'purple' },
  ];
  return <><PageHeader title="Dashboard overview" description="A view of student screening and support."/><DemoNotice/><div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(stat => <StatCard key={stat.label} {...stat}/>)}</div><div className="mb-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]"><ScreeningActivityChart data={activity}/><Panel title="Next steps"><p className="leading-7 text-slate-600">{pending} sample sessions await review. Screening supports professional assessment and does not establish a diagnosis.</p><div className="mt-6 flex flex-wrap gap-3"><a className="primary-button inline-flex" href="#/screenings/new">New screening</a><a className="primary-button inline-flex" href="#/counselling">Review sessions</a></div><p className="mt-5 text-xs text-slate-500">Fixed sample week: {samplePeriod}</p></Panel></div><RecentRecordsTable records={recordRows(data).slice(0, 6)} query={query}/></>;
}
