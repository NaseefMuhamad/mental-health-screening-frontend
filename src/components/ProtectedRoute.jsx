import useAuth from '../hooks/useAuth';
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <p role="alert">Sign in to access this page.</p>;
  if (roles && !roles.includes(user.role)) return <p role="alert">Your role does not have access to this page.</p>;
  return children;
}
