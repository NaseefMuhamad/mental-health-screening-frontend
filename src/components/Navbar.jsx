import { Menu } from 'lucide-react';
import SearchBar from './SearchBar';
export default function Navbar({ activePage, query, onSearch, searchable, menuOpen, onMenuToggle, toggleRef }) {
  return <header className="topbar"><div className="topbar-left"><button ref={toggleRef} className="icon-button menu-toggle" onClick={onMenuToggle} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="sidebar"><Menu /></button><span className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></span></div><div className="topbar-right">{searchable && <SearchBar value={query} onChange={onSearch} />}<span className="avatar" aria-hidden="true">DC</span><div className="profile">Demo counsellor<small>Preview only · not signed in</small></div></div></header>;
}
