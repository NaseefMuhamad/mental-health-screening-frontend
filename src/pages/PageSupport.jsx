// Shared presentation helpers for the pages folder; not route pages.
export function PageHeader({ title, description, children }) {
  return <div className="page-heading"><div><p className="eyebrow">MENTAL HEALTH SCREENING SUPPORT</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>;
}
export function DemoNotice() {
  return <div className="demo-banner"><strong>Demo only</strong><span>Use fictional information. Changes stay in memory and reset on refresh. No backend, model or authentication is connected.</span></div>;
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
export function MissingRecord({ type, href }) {
  return <Panel title={`${type} not found`}><p className="mb-5">Choose a record from the list. Local demo records disappear after refresh.</p><a className="primary-button inline-flex" href={href}>Back to list</a></Panel>;
}
export const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800';
export function routeParam(name) {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.hash.split('?')[1] || '').get(name) || '';
}
export function detailLink(type, id) { return `#/${type}/details?id=${encodeURIComponent(id)}`; }
