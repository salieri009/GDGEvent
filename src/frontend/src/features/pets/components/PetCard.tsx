import { Link } from 'react-router-dom';
import type { Pet } from '@/shared/types/pet';
import DoodleBox from '@/shared/ui/DoodleBox';
import PetStatusBadge from './PetStatusBadge';

interface PetCardProps {
  pet: Pet;
  layout?: 'grid' | 'list';
}

function cardRotation(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % 2;
  }
  return hash === 0 ? 'rotate-1' : '-rotate-1';
}

export default function PetCard({ pet, layout = 'grid' }: PetCardProps) {
  const primaryTag = pet.tags[0] ?? null;
  const ageLabel = pet.age?.split(' ')[0] ?? null;

  if (layout === 'list') {
    return (
      <DoodleBox className="flex flex-col md:flex-row gap-8 group" variant="black">
        <div className="w-full md:w-64 h-64 bg-slate-100 border-2 border-slate-border rounded-geo overflow-hidden relative">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform grayscale contrast-125 opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black uppercase text-slate-400">No photo</div>
          )}
          <PetStatusBadge
            status={pet.status}
            variant="card"
            className="absolute top-4 left-4 pill-badge text-[10px] shadow-sm"
          />
          {primaryTag ? (
            <div className="absolute top-4 right-4 pill-badge shadow-sm">{primaryTag}</div>
          ) : null}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black mb-2 italic tracking-tighter">{pet.name}</h2>
            </div>
            <p className="font-bold text-slate-500 uppercase text-xs tracking-widest mb-4">
              {[pet.breed, pet.age].filter(Boolean).join(' • ') || 'Unknown breed'}
            </p>
            <p className="text-on-surface opacity-80 text-sm leading-relaxed mb-4">{pet.description ?? 'No description yet.'}</p>
          </div>

          <div className="flex gap-4">
            <Link
              to={`/pet/${pet.id}`}
              className="flex-1 py-3 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase text-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus-ring"
            >
              View Profile
            </Link>
          </div>
        </div>
      </DoodleBox>
    );
  }

  return (
    <DoodleBox className="flex flex-col gap-6 group" rotate={cardRotation(pet.id)}>
      <div className="h-48 bg-slate-100 border-2 border-slate-border rounded-geo overflow-hidden relative">
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform grayscale contrast-125 opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-black uppercase text-slate-400">No photo</div>
        )}
        <PetStatusBadge
          status={pet.status}
          variant="card"
          className="absolute top-2 left-2 pill-badge text-[10px] scale-75 shadow-sm"
        />
        {primaryTag ? (
          <div className="absolute top-2 right-2 pill-badge text-[10px] scale-75">{primaryTag}</div>
        ) : null}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-black italic tracking-tighter">
            {ageLabel ? `${pet.name}, ${ageLabel}` : pet.name}
          </h2>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{pet.breed ?? 'Mixed'}</p>
        <p className="text-sm line-clamp-2 mb-6 italic opacity-70">{pet.description ?? 'No description yet.'}</p>
        <Link
          to={`/pet/${pet.id}`}
          className="mt-auto py-3 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase text-center text-sm shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all focus-ring"
        >
          View Profile
        </Link>
      </div>
    </DoodleBox>
  );
}
