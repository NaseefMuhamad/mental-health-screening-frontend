import { useEffect, useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import NewScreening from './pages/NewScreening';
import Screenings from './pages/Screenings';
import ScreeningDetails from './pages/ScreeningDetails';
import Counselling from './pages/Counselling';
import FollowUps from './pages/FollowUps';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Login from './pages/Login';
import AcceptInvitation from './pages/AcceptInvitation';
const routes = {
  '/dashboard': { title: 'Dashboard', key: 'dashboard', Component: Dashboard },
  '/students': { title: 'Students', key: 'students', Component: Students },
  '/students/details': { title: 'Student details', key: 'students', Component: StudentDetails },
  '/screenings/new': { title: 'New screening', key: 'new-screening', Component: NewScreening, roles: ['screening_personnel'] },
  '/screenings': { title: 'Screening records', key: 'screenings', Component: Screenings },
  '/screenings/details': { title: 'Screening details', key: 'screenings', Component: ScreeningDetails },
  '/counselling': { title: 'Counselling', key: 'counselling', Component: Counselling, roles: ['counsellor'] },
  '/follow-ups': { title: 'Follow-ups', key: 'follow-ups', Component: FollowUps, roles: ['counsellor'] },
  '/reports': { title: 'Reports', key: 'reports', Component: Reports },
  '/users': { title: 'Staff management', key: 'users', Component: Users, roles: ['administrator'] },
};
export default function App() {
  const { user, restoring, restoreError, retryRestore } = useAuth();
  const [hash, setHash] = useState(() => window.location.hash || '#/dashboard');
  useEffect(() => { const change = () => setHash(window.location.hash || '#/dashboard'); window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change); }, []);
  const [pathname, query = ''] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query);
  if (restoring) return <AuthLayout><p role="status">Restoring your session…</p></AuthLayout>;
  if (restoreError) return <AuthLayout><h1>Unable to verify your session</h1><p role="alert" className="my-5">{restoreError}</p><button className="primary-button" onClick={retryRestore}>Retry connection</button></AuthLayout>;
  if (pathname === '/accept-invitation' && !user) return <AuthLayout title="Accept invitation"><AcceptInvitation /></AuthLayout>;
  if (!user) return <AuthLayout><Login /></AuthLayout>;
  const route = routes[pathname] || (pathname === '/login' || pathname === '/accept-invitation' ? routes['/dashboard'] : null);
  if (!route) return <DashboardLayout activePage="Page not found"><p>Page not found. <a href="#/dashboard">Open dashboard</a></p></DashboardLayout>;
  const { Component, title, key, roles } = route;
  return <DashboardLayout activePage={title} activeKey={key} routeKey={`${user.id}:${hash}`} searchable={false}>
    <ProtectedRoute roles={roles}><Component key={`${user.id}:${hash}`} studentId={params.get(pathname === '/students/details' ? 'id' : 'studentId') || undefined} screeningId={params.get(pathname === '/screenings/details' ? 'id' : 'screeningId') || undefined} /></ProtectedRoute>
  </DashboardLayout>;
}
