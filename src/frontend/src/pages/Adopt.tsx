import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petService, adoptionService } from '../services/api';
import { Pet } from '../types';
import { ArrowRight, Check } from 'lucide-react';

export default function Adopt() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [favoriteSnack, setFavoriteSnack] = useState('');
  const [promiseGiven, setPromiseGiven] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      petService.getById(id).then(data => {
        setPet(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pet) return;

    setSubmitting(true);
    setError(null);
    try {
      await adoptionService.submit({
        petId: pet.id,
        applicantName,
        favoriteSnack,
        promiseGiven,
      });
      setSubmitted(true);
      setTimeout(() => navigate('/pets'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-48 text-center font-black text-4xl uppercase animate-pulse">Printing papers...</div>;
  if (!pet) return <div className="p-48 text-center text-2xl font-black uppercase">Which dog was it again?</div>;

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24 text-center space-y-10">
        <div className="w-32 h-32 bg-green-100 border-4 border-slate-border rounded-full mx-auto flex items-center justify-center rotate-6 shadow-hard">
          <Check size={64} className="text-green-600 stroke-[4]" />
        </div>
        <h2 className="text-7xl font-black italic uppercase tracking-tighter">Wag-tastic!</h2>
        <p className="text-2xl font-bold uppercase tracking-widest text-slate-400">The papers are flying towards us. We'll bark back soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="relative bg-white p-12 md:p-20 border-4 border-slate-border rounded-geo-lg shadow-geo-lg">
        <header className="mb-16 border-b-4 border-slate-border pb-8">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
            Adoption Papers for <span className="text-primary">{pet.name}</span>
          </h2>
          <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-xl">
             We take our matchmaking very seriously. Please answer these questions with pure honesty.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {error ? (
            <div className="bg-red-50 border-4 border-slate-border rounded-2xl p-6 font-bold text-red-700">
              {error}
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="name">Your Legal Name</label>
              <input 
                required
                type="text" 
                id="name" 
                placeholder="Full Name"
                className="w-full bg-slate-50 border-4 border-slate-border p-5 font-bold text-xl rounded-2xl focus:outline-none focus:bg-white transition-colors placeholder:text-slate-200"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="snack">Favorite Dog Snack</label>
              <input 
                required
                type="text" 
                id="snack" 
                placeholder="Cheese? Bacon?"
                className="w-full bg-slate-50 border-4 border-slate-border p-5 font-bold text-xl rounded-2xl focus:outline-none focus:bg-white transition-colors placeholder:text-slate-200"
                value={favoriteSnack}
                onChange={(e) => setFavoriteSnack(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400">The Sacred Vow</label>
            <div className="flex items-center gap-6 p-6 bg-yellow-50 border-2 border-slate-border rounded-2xl cursor-pointer group hover:bg-yellow-100 transition-colors">
              <input 
                type="checkbox" 
                required 
                id="promise" 
                className="w-10 h-10 border-4 border-slate-border rounded-lg checked:bg-primary accent-primary cursor-pointer" 
                checked={promiseGiven}
                onChange={(e) => setPromiseGiven(e.target.checked)}
              />
              <label htmlFor="promise" className="text-xl font-bold cursor-pointer select-none leading-tight">
                I promise to give {pet.name} belly rubs and unlimited ear scratches.
              </label>
            </div>
          </div>

          <div className="pt-8 flex justify-between items-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">By clicking submit, you agree to become a professional ball thrower.</p>
             <button 
                type="submit"
                disabled={submitting}
                className="group relative flex items-center gap-4 bg-primary border-4 border-slate-border px-12 py-6 text-2xl font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-2xl shadow-hard uppercase tracking-tighter italic text-white"
              >
                {submitting ? 'Sending...' : 'Send it!'}
                <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform stroke-[3]" />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
