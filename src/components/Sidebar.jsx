import useAuth from '../hooks/useAuth';
import { HeartPulse, LayoutDashboard, Users, ClipboardList, ClipboardPlus, MessagesSquare, CalendarDays, BarChart3, UserCog, X } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', href: '#/dashboard', key: 'dashboard' },
  { label: 'Students', href: '#/students', key: 'students' },
  { label: 'New Screening', href: '#/screenings/new', key: 'new-screening' },
  { label: 'Screening Records', href: '#/screenings', key: 'screenings' },
  { label: 'Counselling', href: '#/counselling', key: 'counselling' },
  { label: 'Follow-ups', href: '#/follow-ups', key: 'follow-ups' },
  { label: 'Reports', href: '#/reports', key: 'reports' },
  { label: 'Staff management', href: '#/users', key: 'users' },
];

const icons = { dashboard: LayoutDashboard, students: Users, 'new-screening': ClipboardPlus, screenings: ClipboardList, counselling: MessagesSquare, 'follow-ups': CalendarDays, reports: BarChart3, users: UserCog };

export default function Sidebar({ activeKey, open, onClose, sidebarRef }) {
  const { user } = useAuth();
  const allowed = item => !(['counselling', 'follow-ups'].includes(item.key) && user.role !== 'counsellor') && !(item.key === 'users' && user.role !== 'administrator') && !(item.key === 'new-screening' && user.role !== 'screening_personnel');
  return <aside ref={sidebarRef} id="sidebar" className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Application sidebar">
    <div className="brand"><span className="brand-icon"><HeartPulse aria-hidden="true" /></span><div>Student Wellbeing<small>SCREENING SUPPORT</small></div></div>
    <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X /></button>
    <p className="nav-label">WORKSPACE</p>
    <nav aria-label="Main navigation">{navigation.filter(allowed).map(item => {
      const Icon = icons[item.key];
      return <a key={item.key} href={item.href} aria-current={activeKey === item.key ? 'page' : undefined} className={`nav-item ${activeKey === item.key ? 'active' : ''}`}><Icon size={19} aria-hidden="true" />{item.label}</a>;
    })}</nav>
    <div className="sidebar-note"><span className="live-dot" /> Staff workspace<p>Access follows your staff role and the cases you handle.</p></div>
    <div className="sidebar-footer">Student care, thoughtfully supported.</div>
  </aside>;
}
