import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { isAdminLoggedIn } from '@/features/admin/lib/adminAuth';

export default function Header() {
  const adminLoggedIn = isAdminLoggedIn();

  return (
    <header className="bg-surface sticky top-3 z-40 border-b-4 border-slate-border mx-3">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-7xl mx-auto gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0 focus-ring rounded-full">
          <div className="w-12 h-12 bg-primary border-4 border-slate-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <PawPrint className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic text-on-surface">
            DoodlePaws
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 font-bold uppercase tracking-wider text-xs" aria-label="Main">
          <Link
            to="/pets"
            className="px-4 py-2 bg-primary border-4 border-slate-border rounded-full shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus-ring lg:bg-transparent lg:border-0 lg:shadow-none lg:rounded-none lg:px-0 lg:py-0 hover:text-primary lg:border-b-2 lg:border-transparent lg:hover:border-primary lg:pb-1"
          >
            Adopt a Dog
          </Link>
          <Link
            to="/#why-doodlepaws"
            className="hidden lg:inline hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all focus-ring rounded-sm"
          >
            Success Stories
          </Link>
          <Link
            to="/#why-doodlepaws"
            className="hidden lg:inline hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all focus-ring rounded-sm"
          >
            Foster
          </Link>
        </nav>

        {adminLoggedIn ? (
          <Link
            to="/admin/applications"
            className="bg-slate-border text-white px-4 sm:px-6 py-2 rounded-full font-bold uppercase text-xs tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(255,179,71,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shrink-0 focus-ring"
          >
            Admin
          </Link>
        ) : null}
      </div>
    </header>
  );
}
