import { Link } from 'react-router-dom';
import DoodleBox from '../components/ui/DoodleBox';
import { Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12 md:py-24">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24 min-h-[600px] items-center">
        <div className="md:col-span-7 flex flex-col justify-center gap-8">
          <div className="pill-badge bg-blue-100 w-fit">
            142 Pups waiting for you
          </div>
          <h2 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
            Find your <br/> 
            <span className="text-primary underline decoration-8 underline-offset-8">pawfect</span> <br/>
            companion.
          </h2>
          <p className="text-xl max-w-md font-medium text-slate-600 leading-relaxed">
            Every tail has a story. Start your next chapter today with a rescue who will love you forever.
          </p>
          <div className="flex gap-4 mt-4">
            <Link 
              to="/pets" 
              className="bg-primary border-4 border-slate-border px-8 py-4 rounded-2xl text-xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Browse Pets
            </Link>
            <Link 
              to="/about" 
              className="border-4 border-slate-border px-8 py-4 rounded-2xl text-xl font-black uppercase bg-white hover:bg-slate-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="md:col-span-5 flex flex-col gap-6 h-full justify-center relative z-10">
          <div className="bg-white border-4 border-slate-border rounded-geo-lg shadow-hard p-6 flex flex-col relative group z-10">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary border-4 border-slate-border rounded-full flex items-center justify-center -rotate-12 shadow-lg group-hover:rotate-0 transition-transform z-20">
              <span className="text-center font-black text-xs leading-none uppercase text-white">Featured<br/>Pup</span>
            </div>
            <div className="w-full aspect-[4/5] bg-slate-100 rounded-geo border-2 border-slate-border overflow-hidden mb-4 relative">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfr9tpOLaNxrESVqYN6BYobWVI9cnZjMTWpUKoafs7qwc7DYGPshvJ0uOZa81LDevWBSvN2LifoYA2jO2QF9evfPSFUsAPh_AbG-pJ7jXvWGEEUlfm7olmiD_ZrFkwwDRCN2SV8MgTpfpIqxCOh8pe21TcSwbwcJuru1S0rXgtxxCvYFZ4gxdaWyFbO3ktnDzXTZVxTCnfdbKwai2WmWp886dDup48wO0QDbJMgjInWBIIhtL4XuYnDOP3GmcURBHDjnDZ-rkMyNUq" 
                alt="Featured Dog" 
                className="w-full h-full object-cover grayscale opacity-80"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-slate-border p-4 rounded-xl">
                 <h3 className="font-black text-xl uppercase">Barnaby</h3>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Golden Retriever Mix • 3yrs • Friend</p>
              </div>
            </div>
          </div>

          <div className="h-40 bg-secondary border-4 border-slate-border rounded-2xl p-6 flex items-center justify-between shadow-hard relative z-0">
            <div className="flex flex-col">
              <span className="text-5xl font-black italic">98%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Success Match Rate</span>
            </div>
            <div className="w-px h-full bg-slate-border opacity-20"></div>
            <div className="flex flex-col text-right">
              <span className="text-xl font-black uppercase italic leading-none">Rescue</span>
              <span className="text-xl font-black uppercase italic leading-none">Rehome</span>
              <span className="text-xl font-black uppercase italic leading-none">Repeat</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <div className="flex justify-between items-end mb-12 border-b-4 border-slate-border pb-4">
          <h3 className="text-4xl font-black italic underline decoration-secondary decoration-4 underline-offset-4">Why DoodlePaws?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: "Clumsy Matchmaking", 
              desc: "Our algorithm is just a guy named Greg who draws names out of a shaky hat. It's very personal." 
            },
            { 
              title: "Vaguely Healthy", 
              desc: "Each dog comes with a medical record scribbled on the back of a grocery receipt. Mostly clean bills of health!" 
            },
            { 
              title: "The Pack", 
              desc: "Join a community of owners who also don't care about straight lines or professional photography." 
            }
          ].map((feature, i) => (
            <div key={i} className="group bg-white p-8 border-4 border-slate-border rounded-geo shadow-hard hover:translate-y-1 hover:shadow-none transition-all">
              <div className="w-12 h-12 mb-6 bg-secondary border-2 border-slate-border rounded-full flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h4 className="text-2xl font-black mb-2 italic tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
