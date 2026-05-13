import { Pet } from '../../types';
import { Link } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import DoodleBox from './DoodleBox';

interface PetCardProps {
  pet: Pet;
  layout?: 'grid' | 'list';
  key?: string | number;
}

export default function PetCard({ pet, layout = 'grid' }: PetCardProps) {
  if (layout === 'list') {
    return (
      <DoodleBox className="flex flex-col md:flex-row gap-8 group" variant="black">
        <div className="w-full md:w-64 h-64 bg-slate-100 border-2 border-slate-border rounded-geo overflow-hidden relative">
          <img 
            src={pet.imageUrl} 
            alt={pet.name} 
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform grayscale contrast-125 opacity-80" 
          />
          <div className="absolute top-4 right-4 pill-badge shadow-sm">
            {pet.tags[0]}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black mb-2 italic tracking-tighter">{pet.name}</h2>
              <Heart className="text-slate-border w-8 h-8 hover:fill-primary hover:text-primary transition-all cursor-pointer" />
            </div>
            <p className="font-bold text-slate-500 uppercase text-xs tracking-widest mb-4">{pet.breed} • {pet.age}</p>
            <p className="text-on-surface opacity-80 text-sm leading-relaxed mb-4">{pet.description}</p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              to={`/pet/${pet.id}`}
              className="flex-1 py-3 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase text-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              View Profile
            </Link>
            <button className="p-3 border-4 border-slate-border rounded-2xl hover:bg-secondary transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </DoodleBox>
    );
  }

  return (
    <DoodleBox className="flex flex-col gap-6 group" rotate={Math.random() > 0.5 ? 'rotate-1' : '-rotate-1'}>
      <div className="h-48 bg-slate-100 border-2 border-slate-border rounded-geo overflow-hidden relative">
        <img 
          src={pet.imageUrl} 
          alt={pet.name} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform grayscale contrast-125 opacity-80" 
        />
        <div className="absolute top-2 right-2 pill-badge text-[10px] scale-75">
          {pet.tags[0]}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-black italic tracking-tighter">{pet.name}, {pet.age.split(' ')[0]}</h2>
          <Heart className="text-slate-border w-6 h-6 hover:text-primary transition-colors cursor-pointer" />
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          {pet.breed}
        </p>
        <p className="text-sm line-clamp-2 mb-6 italic opacity-70">{pet.description}</p>
        <Link 
          to={`/pet/${pet.id}`}
          className="mt-auto py-2 border-b-2 border-slate-border font-black text-sm uppercase tracking-widest hover:text-primary transition-all text-center"
        >
          View Profile
        </Link>
      </div>
    </DoodleBox>
  );
}
