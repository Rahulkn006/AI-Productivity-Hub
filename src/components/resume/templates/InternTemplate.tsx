import { ResumeDetails } from "@/lib/resume-types";
import { GraduationCap, Briefcase, Code, User } from "lucide-react";

export function InternTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-16 text-[#2d3748] bg-white min-h-[1120px] font-sans">
      <header className="mb-16 border-b-8 border-[#1a202c] pb-12 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#1a202c] mb-2 opacity-40">
            <User className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Entry Level Candidate</span>
          </div>
          <h1 className="text-6xl font-black tracking-tight text-[#1a202c] leading-none uppercase">{data.personalDetails.fullName || 'PROFESSIONAL NAME'}</h1>
          <p className="text-base font-bold text-[#718096] uppercase tracking-widest pt-2">{data.targetJobRole || 'Aspiring Professional'}</p>
        </div>
        <div className="text-right space-y-2 text-[10px] font-black text-[#a0aec0] uppercase tracking-widest pb-1">
          {data.personalDetails.email && <div>{data.personalDetails.email}</div>}
          {data.personalDetails.phone && <div>{data.personalDetails.phone}</div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-7 space-y-16">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black text-[#1a202c] uppercase mb-8 tracking-[0.4em] flex items-center gap-3">
                <GraduationCap className="w-5 h-5 opacity-40" /> Academic Foundation
              </h2>
              <div className="space-y-10">
                {data.education.map((edu, i) => (
                  <div key={i} className="relative pl-8 border-l border-[#edf2f7]">
                    <div className="absolute -left-[1.5px] top-0 w-[3px] h-4 bg-[#1a202c]" />
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-lg font-bold text-[#1a202c] leading-tight uppercase">{edu.degree}</h3>
                      <span className="text-[10px] font-black text-[#cbd5e0]">{edu.endDate}</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black text-[#1a202c] uppercase mb-8 tracking-[0.4em] flex items-center gap-3">
                <Code className="w-5 h-5 opacity-40" /> Applied Projects
              </h2>
              <div className="space-y-10">
                {data.projects.map((project, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-[#1a202c] uppercase tracking-tight">{project.name}</h3>
                      <div className="h-[1px] flex-1 mx-4 bg-[#f7fafc]" />
                    </div>
                    <p className="text-xs text-[#4a5568] leading-relaxed font-medium mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((t, ti) => (
                        <span key={ti} className="text-[8px] font-black text-[#718096] bg-[#f7fafc] px-2 py-1 rounded-md uppercase border border-[#edf2f7]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-5 space-y-16">
          {data.skills && data.skills.length > 0 && (
            <section className="bg-[#f8fafc] p-8 rounded-[40px] border border-[#edf2f7]">
              <h2 className="text-[10px] font-black text-[#1a202c] uppercase mb-8 tracking-[0.4em]">Skills Portfolio</h2>
              <div className="grid grid-cols-1 gap-4">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#1a202c] opacity-20" />
                     <div className="text-[11px] font-bold text-[#4a5568] uppercase tracking-tighter">{skill}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="px-2">
              <h2 className="text-[10px] font-black text-[#1a202c] uppercase mb-8 tracking-[0.4em] flex items-center gap-3">
                <Briefcase className="w-5 h-5 opacity-40" /> Professional Exposure
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="text-xs font-black text-[#1a202c] uppercase">{exp.role}</h3>
                    <div className="text-[9px] text-[#718096] font-bold uppercase">{exp.company}</div>
                    <p className="text-[8px] text-[#a0aec0] font-black">{exp.startDate} - {exp.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.summary && (
            <section className="px-2 pt-10 border-t border-[#f7fafc]">
               <h2 className="text-[9px] font-black text-[#cbd5e0] uppercase mb-4 tracking-[0.4em]">Personal Objective</h2>
               <p className="text-[10px] leading-relaxed text-[#718096] font-bold italic">
                 "{data.summary}"
               </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
