const tones = { 'Awaiting review': 'amber', Reviewed: 'green', 'Follow-up scheduled': 'blue' };
export default function StatusBadge({ status }) {
  return <span className={`badge ${tones[status] || 'blue'}`}>{status}</span>;
}
