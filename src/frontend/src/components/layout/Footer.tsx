import { Link } from 'react-router-dom';
import { isAdminLoggedIn } from '@/features/admin/lib/adminAuth';

export default function Footer() {
  const operatorHref = isAdminLoggedIn() ? '/admin/applications' : '/admin/login';
  const operatorLabel = isAdminLoggedIn() ? 'Operator dashboard' : 'Operator login';

  return (
    <footer className="mt-16 pt-12 pb-16 flex flex-col md:flex-row justify-between items-end border-t-2 border-slate-200 px-8 max-w-7xl mx-auto w-full gap-8">
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
        <Link
          to="/pets"
          className="px-6 py-4 bg-slate-100 border-4 border-slate-border rounded-xl shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus-ring"
        >
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">The Pack</p>
          <p className="text-lg font-black italic">Meet every pup →</p>
        </Link>
        <div className="px-6 py-4 bg-secondary border-4 border-slate-border rounded-xl shadow-hard">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Grooming Days</p>
          <p className="text-lg font-black italic">Most Saturdays-ish</p>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <Link
          to={operatorHref}
          className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] hover:text-primary focus-ring rounded-sm"
        >
          {operatorLabel}
        </Link>
        <p className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.2em]">DoodlePaws Rescue Network</p>
        <p className="font-black italic uppercase text-2xl tracking-tighter">DoodlePaws v1.0</p>
      </div>
    </footer>
  );
}
