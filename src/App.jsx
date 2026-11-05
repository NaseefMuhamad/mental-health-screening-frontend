import { useEffect, useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
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
import NotFound from './pages/NotFound';

const routes = {
  '/dashboard': { title: 'Dashboard', key: 'dashboard', Component: Dashboard },
  '/students': { title: 'Students', key: 'students', Component: Students },
  '/students/details': { title: 'Student details', key: 'students', Component: StudentDetails },
  '/screenings/new': { title: 'New screening', key: 'new-screening', Component: NewScreening },
  '/screenings': { title: 'Screening records', key: 'screenings', Component: Screenings },
  '/screenings/details': { title: 'Screening details', key: 'screenings', Component: ScreeningDetails },
  '/counselling': { title: 'Counselling', key: 'counselling', Component: Counselling },
  '/follow-ups': { title: 'Follow-ups', key: 'follow-ups', Component: FollowUps },
  '/reports': { title: 'Reports', key: 'reports', Component: Reports },
  '/users': { title: 'Users', key: 'users', Component: Users },
};

// Public fictional preview only. These are not authenticated production routes.
export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#/dashboard');
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/dashboard');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const [pathname, queryString = ''] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(queryString);
  if (pathname === '/login') return <AuthLayout><Login /></AuthLayout>;
  const route = routes[pathname];
  if (!route) return <DashboardLayout activePage="Page not found" activeKey="" routeKey={hash}><NotFound /></DashboardLayout>;
  const { Component, title, key } = route;
  const searchable = pathname === '/dashboard' || pathname === '/screenings';
  return <DashboardLayout activePage={title} activeKey={key} routeKey={hash} searchable={searchable}>
    {({ query }) => <Component query={query}
      studentId={params.get(pathname === '/students/details' ? 'id' : 'studentId') || undefined}
      screeningId={params.get(pathname === '/screenings/details' ? 'id' : 'screeningId') || undefined} />}
  </DashboardLayout>;
}
