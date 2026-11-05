import { useEffect, useRef } from 'react';
import { HeartPulse } from 'lucide-react';

// Presentation only: authentication state and redirects belong to the later auth/App step.
export default function AuthLayout({
  title = 'Workspace access',
  children,
}) {
  const mainRef = useRef(null);

  useEffect(() => {
    document.title = `${title} | Mental Health Screening Support`;
    mainRef.current?.focus();
  }, [title]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <a
        href="#auth-content"
        className="skip-link"
        onClick={event => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>

      <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#/dashboard" className="flex items-center gap-3 text-slate-800">
            <span className="grid size-11 place-items-center rounded-xl bg-[#112c50] text-sky-200">
              <HeartPulse aria-hidden="true" size={25} />
            </span>
            <span className="text-sm font-semibold">
              Student Wellbeing
              <span className="mt-1 block text-[10px] font-normal tracking-widest text-slate-500">
                SCREENING SUPPORT
              </span>
            </span>
          </a>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
            Interface preview
          </span>
        </div>
      </header>

      <main
        id="auth-content"
        ref={mainRef}
        tabIndex={-1}
        aria-label={title}
        className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14"
      >
        {children}
      </main>

      <footer className="mx-auto max-w-3xl px-5 pb-8 text-center text-xs leading-6 text-slate-500">
        Screening supports professional assessment and does not establish a diagnosis.
        <br />
        Demo only. Authentication is not connected.
      </footer>
    </div>
  );
}
