import { useState } from 'react';
import DataTable from '../components/DataTable';
import { useDemoStore, samplePeriod } from './demoStore';
import { PageHeader, DemoNotice, Panel } from './PageSupport';
export default function Reports() {
  const data = useDemoStore();
  const [message, setMessage] = useState('');
  const summary = [
    {id:'students', metric:'Registered students', value:data.students.length},
    {id:'sessions', metric:'Screening sessions', value:data.screenings.length},
    ...['Awaiting review','Reviewed','Follow-up scheduled'].map(status => ({id:status,metric:status,value:data.screenings.filter(item => item.status === status).length})),
    {id:'followups',metric:'Scheduled follow-ups',value:data.followups.filter(item => item.status === 'Scheduled').length},
    {id:'completed',metric:'Completed follow-ups',value:data.followups.filter(item => item.status === 'Completed').length},
  ];
  function download() {
    const csv = ['Sample data only — not a clinical report','Metric,Count',...summary.map(row => `${row.metric},${row.value}`)].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'demo-workflow-summary.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Sample summary downloaded.');
  }
  return <><PageHeader title="Reports" description="Descriptive workflow counts for all records in this demo session."/><DemoNotice/><div className="mb-6"><Panel title="Summary scope"><p className="leading-7 text-slate-600">Counts include all in-memory records, including new demo entries. The dashboard activity chart separately uses the fixed sample week {samplePeriod}. No stress prevalence, anxiety classification or model performance is inferred.</p><button className="primary-button mt-5" onClick={download}>Download sample summary CSV</button><p role="status" className="mt-3 text-sm">{message}</p></Panel></div><section className="panel"><DataTable columns={[{key:'metric',label:'Metric'},{key:'value',label:'Count'}]} rows={summary} caption="Sample workflow report"/></section></>;
}
