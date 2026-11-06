import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// A changed routeKey resets transient search/menu state, while the backend retains saved records.
export default function DashboardLayout({
  activePage = 'Dashboard',
  activeKey = 'dashboard',
  routeKey = activeKey,
  searchable = ['dashboard', 'screenings'].includes(activeKey),
  children,
}) {
  return (
    <DashboardShell
      key={routeKey}
      activePage={activePage}
      activeKey={activeKey}
      searchable={searchable}
    >
      {children}
    </DashboardShell>
  );
}

function DashboardShell({ activePage, activeKey, searchable, children }) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  ));
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const mainRef = useRef(null);
  const mobileMenuOpen = isMobile && menuOpen;

  useEffect(() => {
    document.title = `${activePage} | Mental Health Screening Support`;
    mainRef.current?.focus();
  }, [activePage]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const onResize = event => {
      setIsMobile(event.matches);
      setMenuOpen(false);
      // Prevent focus remaining on a control that becomes hidden at a breakpoint.
      if (sidebarRef.current?.contains(document.activeElement)
        || document.activeElement === toggleRef.current) {
        mainRef.current?.focus();
      }
    };
    media.addEventListener('change', onResize);
    return () => media.removeEventListener('change', onResize);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sidebar = sidebarRef.current;
    const toggleButton = toggleRef.current;
    sidebar?.querySelector('a[aria-current="page"], a[href], button')?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !sidebar) return;

      const controls = [...sidebar.querySelectorAll('a[href], button:not([disabled])')]
        .filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (!sidebar.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      // Cleanup runs after the background becomes interactive again.
      if (toggleButton?.isConnected
        && window.matchMedia('(max-width: 760px)').matches) {
        toggleButton.focus();
      }
    };
  }, [mobileMenuOpen]);

  function skipToContent(event) {
    event.preventDefault();
    mainRef.current?.focus();
  }

  return (
    <div className="dashboard-app">
      <a href="#main-content" className="skip-link" onClick={skipToContent}>
        Skip to content
      </a>

      <div
        inert={(isMobile && !mobileMenuOpen) || undefined}
        aria-hidden={(isMobile && !mobileMenuOpen) || undefined}
      >
        <Sidebar
          activeKey={activeKey}
          open={mobileMenuOpen}
          onClose={() => setMenuOpen(false)}
          sidebarRef={sidebarRef}
        />
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="workspace" inert={mobileMenuOpen || undefined}>
        <Navbar
          activePage={activePage}
          query={query}
          onSearch={setQuery}
          searchable={searchable}
          menuOpen={mobileMenuOpen}
          onMenuToggle={() => setMenuOpen(open => !open)}
          toggleRef={toggleRef}
        />
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {typeof children === 'function' ? children({ query }) : children}
          <footer className="page-footer">
            <span>Mental Health Screening Support</span>
            <span>Staff workspace · records supplied by the backend</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
