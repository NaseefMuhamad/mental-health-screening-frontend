// Presentation guard only. The backend must enforce access permissions on every request.
// The parent supplies authentication state once the auth workflow is implemented.
export default function ProtectedRoute({
  user = null,
  loading = false,
  allowedRoles = [],
  children,
  unauthenticatedFallback,
  forbiddenFallback,
}) {
  if (loading) {
    return <p role="status" className="empty-state">Checking your session…</p>;
  }

  if (!user) {
    return unauthenticatedFallback ?? (
      <section className="panel placeholder" aria-labelledby="sign-in-required">
        <h2 id="sign-in-required">Sign in required</h2>
        <p>Sign in to access this section.</p>
      </section>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return forbiddenFallback ?? (
      <section className="panel placeholder" aria-labelledby="access-restricted">
        <h2 id="access-restricted">Access restricted</h2>
        <p>Your account does not have permission to view this section.</p>
      </section>
    );
  }

  return children;
}
