import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import RetryPanel from '@/shared/ui/RetryPanel';
import { isPetAvailable } from '@/shared/lib/petStatus';
import { submitAdoptionApplication } from '../api/adoptionApi';
import { adoptionErrorMessage } from '../lib/adoptionErrors';
import { usePet } from '@/features/pets/hooks/usePets';

export default function AdoptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, loading, error: loadError, reload } = usePet(id);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [favoriteSnack, setFavoriteSnack] = useState('');
  const [promiseGiven, setPromiseGiven] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pet) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitAdoptionApplication({
        petId: pet.id,
        applicantName: applicantName.trim(),
        favoriteSnack: favoriteSnack.trim(),
        promiseGiven,
      });
      setSubmitted(true);
      setTimeout(() => navigate('/pets'), 3000);
    } catch (err) {
      setError(adoptionErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-48 text-center font-black text-4xl uppercase animate-pulse">Printing papers...</div>;
  }

  if (loadError) {
    return <RetryPanel message={loadError} onRetry={() => void reload()} />;
  }

  if (!pet) {
    return (
      <div className="p-48 text-center space-y-6">
        <p className="text-2xl font-black uppercase">Which dog was it again?</p>
        <Link
          to="/pets"
          className="inline-block px-8 py-4 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Back to the Pack
        </Link>
      </div>
    );
  }

  if (!isPetAvailable(pet)) {
    return (
      <div className="p-48 text-center space-y-6">
        <p className="text-2xl font-black uppercase">{pet.name} is not available for adoption right now.</p>
        <p className="text-slate-500 font-bold uppercase text-sm">Status: {pet.status}</p>
        <Link
          to={`/pet/${pet.id}`}
          className="inline-block px-8 py-4 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24 text-center space-y-10">
        <div className="w-32 h-32 bg-green-100 border-4 border-slate-border rounded-full mx-auto flex items-center justify-center rotate-6 shadow-hard">
          <Check size={64} className="text-green-600 stroke-[4]" />
        </div>
        <h2 className="text-7xl font-black italic uppercase tracking-tighter">Wag-tastic!</h2>
        <p className="text-2xl font-bold uppercase tracking-widest text-slate-400">The papers are flying towards us. We&apos;ll bark back soon!</p>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Redirecting to the pack in 3 seconds...</p>
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
            <div className="bg-red-50 border-4 border-slate-border rounded-2xl p-6 font-bold text-red-700">{error}</div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="name">
                Your Legal Name
              </label>
              <input
                required
                type="text"
                id="name"
                maxLength={200}
                placeholder="Full Name"
                className="w-full bg-slate-50 border-4 border-slate-border p-5 font-bold text-xl rounded-2xl focus:outline-none focus:bg-white transition-colors placeholder:text-slate-200"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="snack">
                Favorite Dog Snack
              </label>
              <input
                required
                type="text"
                id="snack"
                maxLength={200}
                placeholder="Cheese? Bacon?"
                className="w-full bg-slate-50 border-4 border-slate-border p-5 font-bold text-xl rounded-2xl focus:outline-none focus:bg-white transition-colors placeholder:text-slate-200"
                value={favoriteSnack}
                onChange={(e) => setFavoriteSnack(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <span className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400">The Sacred Vow</span>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">
              By clicking submit, you agree to become a professional ball thrower.
            </p>
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
