export default function StatCard({ label, value, description, icon: Icon, tone = 'blue' }) {
  return <article className="stat-card"><div className="stat-head"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={20} aria-hidden="true"/></span></div><strong className="stat-value">{value}</strong><p>{description}</p></article>;
}
