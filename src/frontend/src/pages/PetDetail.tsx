import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petService } from '../services/api';
import { Pet } from '../types';
import { Heart, ArrowLeft, ArrowRight, Info, Calendar, MapPin, Bone, Share2, PawPrint } from 'lucide-react';
import DoodleBox from '../components/ui/DoodleBox';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      petService.getById(id).then(data => {
        setPet(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-48 text-center font-black text-4xl uppercase animate-pulse italic">Studying the records...</div>;
  if (!pet) return <div className="p-48 text-center text-2xl uppercase font-black">Pup not found!</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
      <Link to="/pets" className="flex items-center gap-2 text-slate-400 hover:text-primary mb-8 group transition-colors">
        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform stroke-[3]" />
        <span className="font-black text-sm uppercase tracking-[0.2em]">Back to the Pack</span>
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        <div className="lg:col-span-5 relative group z-10">
          <div className="absolute -inset-4 bg-secondary rounded-geo shadow-hard -rotate-1 z-0"></div>
          <div className="relative bg-white border-4 border-slate-border p-3 rounded-geo-lg shadow-geo transition-transform group-hover:rotate-0 z-10">
            <img 
              src={pet.imageUrl} 
              alt={pet.name} 
              className="w-full aspect-square object-cover rounded-geo grayscale contrast-125 opacity-90" 
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-primary border-4 border-slate-border px-8 py-3 rotate-6 z-20 font-black text-white uppercase text-xl shadow-hard">
            Available!
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-2">
            <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter leading-none">{pet.name}</h2>
            <div className="flex gap-3">
              <span className="pill-badge bg-blue-100">{pet.breed}</span>
              <span className="pill-badge bg-yellow-100">{pet.age}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { icon: <Calendar />, label: "Born around", value: "May 2021" },
              { icon: <MapPin />, label: "Located in", value: "Greenville" },
              { icon: <Bone />, label: "Fav Activities", value: pet.likes.join(", ") },
              { icon: <Info />, label: "Record ID", value: pet.refId }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-white border-2 border-slate-border rounded-xl shadow-sm">
                <div className="p-2 bg-slate-100 rounded-lg text-primary">{item.icon}</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{item.label}</p>
                  <p className="font-bold text-on-surface leading-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Heart className="w-10 h-10 text-slate-border hover:fill-primary transition-all cursor-pointer stroke-[3]" />
            <Share2 className="w-10 h-10 text-slate-border hover:text-secondary transition-all cursor-pointer stroke-[3]" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12">
        <DoodleBox className="lg:col-span-2" variant="default">
          <h3 className="text-3xl font-black mb-8 italic underline decoration-secondary decoration-8 underline-offset-4">Personality Traits</h3>
          <div className="space-y-8 text-xl font-medium leading-relaxed text-slate-600">
            <p className="first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:text-primary">
              {pet.description}
            </p>
            <div className="p-10 bg-slate-50 border-4 border-slate-border rounded-geo-lg italic shadow-hard-blue">
               "He isn't the fastest dog. He isn't the smartest dog. But he will look at you with eyes that say, 'I have no idea what is happening, but I love you very much.'"
            </div>
          </div>
        </DoodleBox>

        <div className="space-y-8">
          <div className="bg-secondary border-4 border-slate-border p-8 rounded-geo-lg shadow-hard">
            <h4 className="text-2xl font-black uppercase mb-4 italic leading-none">Vibe Check</h4>
            <div className="space-y-6">
               <div className="flex justify-between font-black uppercase text-xs tracking-widest text-slate-700">
                  <span>Sleepy</span>
                  <span>Wild</span>
               </div>
               <div className="h-6 w-full bg-white border-4 border-slate-border rounded-full overflow-hidden p-1">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: '75%' }}></div>
               </div>
               <p className="text-sm font-bold text-center italic opacity-70 uppercase">Mostly just wants to nap on your feet</p>
            </div>
          </div>
          
          <DoodleBox className="bg-white" rotate="rotate-2">
            <p className="text-center font-black uppercase tracking-tighter text-3xl italic leading-none">
              Rescue.<br/>Rehome.<br/>Repeat.
            </p>
          </DoodleBox>
        </div>
      </section>

      <div className="py-24 flex flex-col items-center gap-10 bg-blue-50 border-4 border-slate-border rounded-geo-lg shadow-geo relative overflow-hidden">
        <div className="absolute -top-12 -left-12 text-blue-100 scale-[4] -rotate-12 select-none pointer-events-none">
          <PawPrint size={100} />
        </div>
        <div className="text-center space-y-4 relative z-10">
          <p className="font-bold uppercase tracking-[0.3em] text-slate-400 text-xs">Ready for the next step?</p>
          <h3 className="text-6xl font-black italic tracking-tighter uppercase">Bring {pet.name} Home</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">Is your house too quiet and your shoes too intact? Barnaby is ready to fix that for you.</p>
        </div>
        <Link 
          to={`/adopt/${pet.id}`}
          className="group relative px-16 py-6 bg-primary text-white border-8 border-slate-border rounded-full shadow-hard-blue hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-6"
        >
          <span className="text-4xl font-black uppercase tracking-tighter italic">Apply to Adopt</span>
          <ArrowRight size={40} className="group-hover:translate-x-4 transition-transform stroke-[4]" />
        </Link>
      </div>
    </div>
  );
}
