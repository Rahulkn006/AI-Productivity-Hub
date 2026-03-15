import { ResumeDetails } from "@/lib/resume-types";
import { GraduationCap, Award, BookOpen } from "lucide-react";

export function HealthcareTemplate({ data }: { data: ResumeDetails }) {
  // REBRANDED AS 'SCHOLAR MINIMAL'
  return (
    <div className="p-16 text-[#1a1a1a] bg-white min-h-[1120px] font-serif border-x-[1px] border-[#e2e8f0]">
      <header className="mb-16 border-b-2 border-[#1a1a1a] pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] mb-4">{data.personalDetails.fullName || 'Academic Candidate'}</h1>
        <div className="flex flex-wrap gap-8 text-[11px] font-bold text-[#64748b] uppercase tracking-widest">
          {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
          {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
          {data.personalDetails.linkedin && <span>LINKEDIN</span>}
        </div>
      </header>

      <div className="space-y-14">
        {data.education && data.education.length > 0 && (
          <section className="grid grid-cols-12 gap-10">
            <div className="col-span-3">
               <h2 className="text-[10px] font-black uppercase text-[#1a1a1a] tracking-[0.3em] flex items-center gap-2">
                 <GraduationCap className="w-4 h-4" /> Education
               </h2>
            </div>
            <div className="col-span-9 space-y-8">
              {data.education.map((edu, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-[#1a1a1a]">{edu.degree}</h3>
                    <span className="text-[10px] font-bold text-[#94a3b8]">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#64748b] uppercase italic">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="grid grid-cols-12 gap-10">
            <div className="col-span-3">
               <h2 className="text-[10px] font-black uppercase text-[#1a1a1a] tracking-[0.3em] flex items-center gap-2">
                 <BookOpen className="w-4 h-4" /> Portfolio
               </h2>
            </div>
            <div className="col-span-9 space-y-10">
              {data.projects.map((project, i) => (
                <div key={i}>
                  <h3 className="font-bold text-sm uppercase text-[#1a1a1a] mb-2">{project.name}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line text-justify font-medium">
                    {project.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                     {project.technologies.map((t, ti) => <span key={ti} className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-tighter">[{t}]</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section className="grid grid-cols-12 gap-10">
            <div className="col-span-3">
               <h2 className="text-[10px] font-black uppercase text-[#1a1a1a] tracking-[0.3em] flex items-center gap-2">
                 <Award className="w-4 h-4" /> Skills
               </h2>
            </div>
            <div className="col-span-9 grid grid-cols-3 gap-y-4">
               {data.skills.map((skill, i) => (
                 <div key={i} className="text-[10px] font-bold text-[#334155] uppercase tracking-tighter border-l-2 border-[#f1f5f9] pl-3">
                   {skill}
                 </div>
               ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="grid grid-cols-12 gap-10 border-t border-[#f1f5f9] pt-14">
            <div className="col-span-3">
               <h2 className="text-[10px] font-black uppercase text-[#1a1a1a] tracking-[0.3em] pt-1">Internships</h2>
            </div>
            <div className="col-span-9 space-y-10">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-sm text-[#1a1a1a] uppercase">{exp.role}</h3>
                    <span className="text-[9px] font-bold text-[#bdc3c7]">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-[10px] font-bold text-[#64748b] mb-4 italic uppercase">{exp.company}</div>
                  <p className="text-xs text-[#475569] leading-relaxed font-medium">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
