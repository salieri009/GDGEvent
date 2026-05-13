import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-surface sticky top-3 z-40 border-b-4 border-slate-border mx-3">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-primary border-4 border-slate-border rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <PawPrint className="text-white w-6 h-6" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic text-on-surface">
            DoodlePaws
          </span>
        </Link>
        
        <nav className="hidden lg:flex gap-8 font-bold uppercase tracking-wider text-xs">
          <Link to="/pets" className="hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all">Adopt a Dog</Link>
          <Link to="/about" className="hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all">Success Stories</Link>
          <Link to="/foster" className="hover:text-primary border-b-2 border-transparent hover:border-primary pb-1 transition-all">Foster</Link>
        </nav>

        <button className="bg-slate-border text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(255,179,71,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          Login
        </button>
      </div>
    </header>
  );
}
