import { useEffect, useState } from 'react';
import { petService } from '../services/api';
import { Pet } from '../types';
import PetCard from '../components/ui/PetCard';
import { Search, Filter, X } from 'lucide-react';

export default function PetsList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petService.getAll().then(data => {
      setPets(data);
      setLoading(false);
    });
  }, []);

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <section className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Search for a companion..."
              className="w-full p-5 bg-white border-4 border-slate-border rounded-2xl shadow-hard transition-all focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none font-bold text-xl placeholder:text-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
          </div>
          <button className="px-8 py-5 bg-secondary border-4 border-slate-border rounded-2xl shadow-hard flex items-center gap-3 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
            <Filter size={20} className="stroke-[3]" />
            <span className="font-black text-sm uppercase tracking-widest">FILTERS</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {['Very Wiggly', 'High Energy', 'Expert Napper'].map(tag => (
            <span key={tag} className="pill-badge flex items-center gap-2 group cursor-pointer hover:bg-secondary transition-colors">
              {tag} <X size={14} className="group-hover:scale-125 transition-transform" />
            </span>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-48">
          <div className="text-4xl font-black italic tracking-tighter animate-pulse uppercase">Fetching the pack...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
