import { useState } from 'react';
import { Menu } from 'lucide-react';
import useAuth from '../hooks/useAuth';
export default function Navbar({ activePage, menuOpen, onMenuToggle, toggleRef }) {
  const { user, logout } = useAuth(); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function signOut() { setBusy(true); setError(''); try { await logout(); } catch (cause) { setError(cause.message); } finally { setBusy(false); } }
  return <header className="topbar"><div className="topbar-left"><button ref={toggleRef} className="icon-button menu-toggle" onClick={onMenuToggle} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="sidebar"><Menu /></button><span className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></span></div><div className="topbar-right"><span className="avatar" aria-hidden="true">{user.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div className="profile">{user.name}<small>{user.role.replaceAll('_', ' ')}</small></div><button className="secondary-button" onClick={signOut} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'}</button>{error && <span role="alert" className="text-xs text-red-700">{error}</span>}</div></header>;
}
