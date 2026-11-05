import { Search } from 'lucide-react';
export default function SearchBar({ value, onChange }) {
  return <label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search sample records by student, ID or status</span><input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder="Search sample records…" /></label>;
}
