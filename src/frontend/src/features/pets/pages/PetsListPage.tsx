import { Fragment, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import PetCard from '../components/PetCard';
import { FILTER_TAGS } from '../constants';
import { usePets } from '../hooks/usePets';
import { filterPets } from '../utils/filterPets';
import RetryPanel from '@/shared/ui/RetryPanel';
import LoadingMessage from '@/shared/ui/LoadingMessage';
import { UI_COPY } from '@/shared/constants/uiCopy';

export default function PetsListPage() {
  const { data: pets, loading, error, reload } = usePets();
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTags([]);
  };

  const hasActiveFilters = search.length > 0 || activeTags.length > 0;

  const filteredPets = useMemo(
    () => filterPets(pets ?? [], search, activeTags),
    [pets, search, activeTags],
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">The Pack</h1>
        <p className="text-slate-500 font-medium max-w-xl">
          Browse every pup — available, pending, and adopted. Find your match and apply when you&apos;re ready.
        </p>
      </header>

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
              className="w-full p-5 bg-white border-4 border-slate-border rounded-2xl shadow-hard transition-all focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none focus-visible:ring-4 focus-visible:ring-primary font-bold text-xl placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{UI_COPY.filters.orHint}</p>

        <div className="flex flex-wrap gap-3">
          {FILTER_TAGS.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
                className={`pill-badge flex items-center gap-2 cursor-pointer transition-colors focus-ring ${
                  active ? 'bg-secondary ring-2 ring-slate-border' : 'hover:bg-secondary'
                }`}
              >
                {tag}
                {active ? <X size={14} className="scale-125" aria-hidden /> : null}
              </button>
            );
          })}
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              {UI_COPY.filters.activeLabel}
              {activeTags.length > 0 ? `: ${activeTags.join(', ')}` : ''}
              {search ? ` · "${search}"` : ''}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
            >
              {UI_COPY.filters.clearAll}
            </button>
          </div>
        ) : null}
      </section>

      {loading ? (
        <LoadingMessage className="flex justify-center py-48">{UI_COPY.loading.petsList}</LoadingMessage>
      ) : error ? (
        <RetryPanel message={error} onRetry={() => void reload()} className="flex flex-col items-center py-48" />
      ) : filteredPets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-48 text-center gap-6">
          <p className="text-2xl font-black italic uppercase tracking-tighter text-slate-400 max-w-md">
            {(pets ?? []).length === 0 ? UI_COPY.empty.noPups : UI_COPY.empty.noFilterMatch}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="px-8 py-4 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {UI_COPY.filters.clearAll}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <p className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            Showing {filteredPets.length} pup{filteredPets.length === 1 ? '' : 's'}
            {hasActiveFilters ? ' matching your filters' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPets.map((pet) => (
            <Fragment key={pet.id}>
              <PetCard pet={pet} />
            </Fragment>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
