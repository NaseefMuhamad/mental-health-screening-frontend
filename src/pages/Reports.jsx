import { useCallback } from 'react';
import useResource from '../hooks/useResource';
import { request } from '../services/api';
import { PageHeader, Panel } from './PageSupport';
import { label, date } from './liveFormat';
import { ResourceState } from './LiveSupport';
export default function Reports() {
  const load = useCallback(signal => request('/reports/summary', { signal }), []); const resource = useResource(load);
  return <><PageHeader title="Operational report" description="Screening totals follow your role. Counsellor follow-up totals cover assigned cases only." /><ResourceState resource={resource}>{summary => <Panel title="Screening and follow-up totals"><p className="mb-5">Scope: {label(summary.scope)} · Generated {date(summary.generated_at)}</p><dl className="live-details">{Object.entries(summary).filter(([key]) => !['scope','generated_at'].includes(key)).map(([key,value]) => <div key={key}><dt>{label(key)}</dt><dd>{value}</dd></div>)}</dl><button className="secondary-button" onClick={resource.reload}>Refresh report</button></Panel>}</ResourceState></>;
}
