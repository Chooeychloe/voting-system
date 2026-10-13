import { NavLink } from "react-router-dom";

function SiteHeader() {
  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100`;

  return (
    <header className="app-header sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
          <span className="brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-slate-950 sm:text-base">IoT Project Voting</span>
            <span className="hidden text-xs text-slate-500 sm:block">Student project showcase</span>
          </span>
        </NavLink>

        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          <NavLink to="/results" className={linkClass}>Results</NavLink>
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
