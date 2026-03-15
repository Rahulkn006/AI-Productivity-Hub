import { ResumeDetails } from "@/lib/resume-types";
import { LayoutGrid, Layers, Award, Target } from "lucide-react";

export function GridProfessionalTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-12 text-[#1e293b] bg-[#f8fafc] min-h-[1120px] font-sans selection:bg-[#0f172a] selection:text-white">
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-[#e2e8f0]">
        {/* Header Block */}
        <header className="p-12 bg-[#0f172a] text-white flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight leading-none uppercase">{data.personalDetails.fullName || 'PROFESSIONAL NAME'}</h1>
            <p className="text-sm font-bold text-[#94a3b8] uppercase tracking-[0.4em]">{data.targetJobRole || 'Aspiring Professional'}</p>
          </div>
          <div className="text-right space-y-1 text-[10px] font-bold text-[#94a3b8] uppercase">
            {data.personalDetails.email && <div>{data.personalDetails.email}</div>}
            {data.personalDetails.phone && <div>{data.personalDetails.phone}</div>}
          </div>
        </header>

        <div className="p-12 grid grid-cols-12 gap-12">
          {/* Summary Block */}
          {data.summary && (
            <div className="col-span-12 p-8 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] flex items-center gap-10">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-[#e2e8f0] shrink-0 shadow-sm">
                  <Target className="w-8 h-8 text-[#0f172a]" />
              </div>
              <p className="text-base font-medium leading-relaxed text-[#475569]">
                {data.summary}
              </p>
            </div>
          )}

          {/* Left Column */}
          <div className="col-span-8 space-y-12">
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase text-[#0f172a] mb-8 tracking-widest flex items-center gap-3">
                  <Layers className="w-5 h-5" /> Professional Experience
                </h2>
                <div className="space-y-10">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="relative group">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-bold text-[#0f172a] tracking-tight truncate max-w-[70%] uppercase leading-none">{exp.role}</h3>
                        <span className="text-[9px] font-black text-[#94a3b8] uppercase shrink-0">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-xs font-bold text-[#64748b] mb-4 uppercase tracking-widest italic">{exp.company}</div>
                      <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line font-medium text-justify">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects && data.projects.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase text-[#0f172a] mb-8 tracking-widest flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5" /> Applied Projects
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.projects.map((project, i) => (
                    <div key={i} className="p-6 bg-white border border-[#e2e8f0] rounded-2xl hover:bg-[#f8fafc] transition-all hover:shadow-md group">
                      <h3 className="text-xs font-black text-[#0f172a] uppercase mb-2 group-hover:underline">{project.name}</h3>
                      <p className="text-[10px] text-[#64748b] leading-relaxed font-medium line-clamp-3">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                          {project.technologies.slice(0,3).map((t, ti) => (
                              <span key={ti} className="text-[7px] font-bold text-[#94a3b8] px-1.5 py-0.5 border border-[#f1f5f9] rounded uppercase">#{t}</span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-12">
          {data.skills && data.skills.length > 0 && (
            <section>
               <h2 className="text-[11px] font-black uppercase text-[#0f172a] mb-6 tracking-widest flex items-center gap-3">
                 <Award className="w-5 h-5" /> Core Skills
               </h2>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map((skill, i) => (
                   <div key={i} className="text-[9px] font-bold text-[#475569] bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-lg uppercase shadow-sm">
                     {skill}
                   </div>
                 ))}
               </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
               <h2 className="text-[11px] font-black uppercase text-[#0f172a] mb-6 tracking-widest">Education</h2>
               <div className="space-y-8">
                 {data.education.map((edu, i) => (
                   <div key={i} className="space-y-1.5">
                     <h3 className="text-[11px] font-black text-[#0f172a] leading-tight uppercase">{edu.degree}</h3>
                     <div className="text-[10px] text-[#64748b] font-bold uppercase italic tracking-tight">{edu.institution}</div>
                     <div className="text-[9px] text-[#bdc3c7] font-bold">{edu.endDate}</div>
                   </div>
                 ))}
               </div>
            </section>
          )}

            <div className="pt-10 border-t border-[#f1f5f9]">
                <div className="p-6 bg-[#0f172a] rounded-2xl text-white space-y-3">
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 leading-tight">Authenticity Clause</div>
                    <p className="text-[9px] leading-relaxed font-bold opacity-60">
                        Information contained herein is accurate and verifiable upon formal request.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
