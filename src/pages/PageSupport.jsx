// Shared presentation helpers for the pages folder; not route pages.
export function PageHeader({ title, description, children }) {
  return <div className="page-heading"><div><p className="eyebrow">MENTAL HEALTH SCREENING SUPPORT</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>;
}
export function Panel({ title, children }) {
  return <section className="panel p-5 sm:p-6">{title && <h2 className="mb-5">{title}</h2>}{children}</section>;
}
export function Field({ label, children }) {
  return <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-slate-700">{label}{children}</label>;
}
export function Feedback({ error, message }) {
  return <>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p>}</>;
}
