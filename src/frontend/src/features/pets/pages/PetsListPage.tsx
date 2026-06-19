import { Fragment, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import PetCard from '../components/PetCard';
import { FILTER_TAGS } from '../constants';
import { usePets } from '../hooks/usePets';
import { filterPets } from '../utils/filterPets';
import RetryPanel from '@/shared/ui/RetryPanel';

export default function PetsListPage() {
  const { data: pets, loading, error, reload } = usePets();
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const filteredPets = useMemo(
    () => filterPets(pets ?? [], search, activeTags),
    [pets, search, activeTags],
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <section className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <label htmlFor="pet-search" className="sr-only">
              Search for a companion
            </label>
            <input
              id="pet-search"
              type="search"
              placeholder="Search for a companion..."
              className="w-full p-5 bg-white border-4 border-slate-border rounded-2xl shadow-hard transition-all focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none font-bold text-xl placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {FILTER_TAGS.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
                className={`pill-badge flex items-center gap-2 cursor-pointer transition-colors ${
                  active ? 'bg-secondary ring-2 ring-slate-border' : 'hover:bg-secondary'
                }`}
              >
                {tag} <X size={14} className={active ? 'scale-125' : ''} />
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-48">
          <div className="text-4xl font-black italic tracking-tighter animate-pulse uppercase">Fetching the pack...</div>
        </div>
      ) : error ? (
        <RetryPanel message={error} onRetry={() => void reload()} className="flex flex-col items-center py-48" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPets.map((pet) => (
            <Fragment key={pet.id}>
              <PetCard pet={pet} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
