import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import VideoPlayer from './VideoPlayer';

export default async function VideoFunnel({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // 1. Fetch Video Job
  const job = await prisma.videoJob.findUnique({
    where: { id },
    include: { organization: { include: { settings: true } } }
  });

  if (!job) return notFound();

  const settings = job.organization.settings;
  const primaryColor = settings?.primaryColor || '#06b6d4';
  const logoUrl = settings?.companyLogo || 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png'; 
  const calendlyUrl = settings?.calendlyUrl || 'https://calendly.com';

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">

      {/* Brand Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between border-b border-white/10" style={{ backgroundColor: `${primaryColor}10` }}>
         {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="h-8 object-contain" />
         ) : (
            <div className="text-xl font-black uppercase tracking-widest" style={{ color: primaryColor }}>AURA B2B</div>
         )}
         <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Personalized Proposal
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
               A special message for {job.title.includes('Outreach:') ? job.title.split('Outreach: ')[1] : 'you'}.
            </h1>
            <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex items-center justify-center">
               {job.videoUrl ? (
                  <VideoPlayer url={job.videoUrl} poster={logoUrl} jobId={job.id} />
               ) : (
                  <>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                     <div className="text-zinc-600 flex flex-col items-center z-20">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center cursor-wait backdrop-blur-md border border-white/10" style={{ color: primaryColor }}>
                           <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest">Video is still rendering...</p>
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* Call to Action Section (Calendly) */}
         <div className="lg:col-span-4 flex flex-col justify-center space-y-8">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6 shadow-2xl">
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter">Ready to connect?</h2>
                  <p className="text-sm text-zinc-400">Pick a time that works best for you to discuss how we can help scale your operations.</p>
               </div>
               
               <a 
                 href={calendlyUrl} 
                 target="_blank"
                 className="block w-full py-4 text-center text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:scale-105"
                 style={{ backgroundColor: primaryColor }}
               >
                 Book a Meeting
               </a>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.01] space-y-4">
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Proposal Highlights</h3>
               <ul className="space-y-3">
                  {['Automated workflows', 'Reduced latency', 'Enterprise security'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
