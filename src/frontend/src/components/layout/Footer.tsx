import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 pt-12 pb-16 flex flex-col md:flex-row justify-between items-end border-t-2 border-slate-200 px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
        <Link
          to="/pets"
          className="px-6 py-4 bg-slate-100 border-4 border-slate-border rounded-xl shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Available Pups</p>
          <p className="text-lg font-black italic">Meet the pack →</p>
        </Link>
        <div className="px-6 py-4 bg-secondary border-4 border-slate-border rounded-xl shadow-hard">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Grooming Days</p>
          <p className="text-lg font-black italic">Most Saturdays-ish</p>
        </div>
      </div>
      <div className="text-right mt-8 md:mt-0">
        <p className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.2em] mb-1">DoodlePaws Rescue Network</p>
        <p className="font-black italic uppercase text-2xl tracking-tighter">v.2.0.1 - &quot;Geometric Balance&quot;</p>
      </div>
    </footer>
  );
}
