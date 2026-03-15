import { ResumeDetails } from "@/lib/resume-types";
import { Zap, Command, Layers } from "lucide-react";

export function CreativeTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-0 text-[#334155] bg-white min-h-[1120px] font-sans selection:bg-[#0f172a] selection:text-white">
      {/* Decorative Top Border */}
      <div className="h-2 bg-[#000000]" />
      
      <div className="p-16 relative">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-start gap-12 border-b-2 border-[#f1f5f9] pb-12">
          <div className="space-y-3">
            <h1 className="text-6xl font-black tracking-tighter text-[#0f172a] leading-[0.9] uppercase">
              {data.personalDetails.fullName?.split(' ')[0] || 'FIRST'}<br/>
              <span className="text-[#cccccc]">{data.personalDetails.fullName?.split(' ')[1] || 'LAST'}</span>
            </h1>
            <p className="text-xs font-black text-[#0f172a] uppercase tracking-[0.4em] pt-4">{data.targetJobRole || 'Creative Professional'}</p>
          </div>
          <div className="text-right space-y-4 pt-1">
             <div className="text-xs font-bold uppercase text-[#0f172a] border-b border-[#f1f5f9] pb-1">{data.personalDetails.email}</div>
             <div className="text-xs font-bold uppercase text-[#94a3b8]">{data.personalDetails.phone}</div>
             <div className="flex justify-end gap-1.5 pt-2">
                <Command className="w-5 h-5 text-[#000000]" />
                <Layers className="w-5 h-5 text-[#cccccc]" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-16">
          {/* Main Column */}
          <div className="col-span-7 space-y-16">
            {data.summary && (
              <section className="space-y-4">
                 <h2 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest opacity-30">Identity Manifesto</h2>
                 <p className="text-lg font-light leading-relaxed text-[#475569] border-l-4 border-[#0f172a] pl-8">
                   {data.summary}
                 </p>
              </section>
            )}

            {data.experience && data.experience.length > 0 && (
              <section className="space-y-10">
                <h2 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest opacity-30">Execution History</h2>
                <div className="space-y-12">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter leading-none">{exp.role}</h3>
                        <span className="text-[9px] font-bold text-[#94a3b8] uppercase">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-4 italic">{exp.company}</div>
                      <p className="text-sm text-[#475569] leading-relaxed font-medium">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-5 space-y-16">
            {data.skills && data.skills.length > 0 && (
              <section className="bg-[#fcfcfc] p-8 rounded-3xl border border-[#f1f5f9]">
                 <h2 className="text-[10px] font-black text-[#0f172a] uppercase mb-8 tracking-widest flex items-center gap-2">
                   <Zap className="w-4 h-4" /> Core Arsenal
                 </h2>
                 <div className="flex flex-col gap-4">
                   {data.skills.map((skill, i) => (
                     <div key={i} className="text-[11px] font-bold text-[#475569] uppercase border-b border-[#f1f5f9] pb-1.5 flex justify-between group">
                       <span>{skill}</span>
                       <span className="text-[#e2e8f0] opacity-0 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                     </div>
                   ))}
                 </div>
              </section>
            )}

            {data.education && data.education.length > 0 && (
              <section className="px-4 space-y-8">
                <h2 className="text-[10px] font-black text-[#0f172a] uppercase mb-10 tracking-widest opacity-30">Foundation</h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="space-y-1.5">
                    <h3 className="font-black text-xs text-[#0f172a] uppercase leading-tight">{edu.degree}</h3>
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-tight">{edu.institution}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
