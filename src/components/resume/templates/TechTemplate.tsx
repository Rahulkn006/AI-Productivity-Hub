import { ResumeDetails } from "@/lib/resume-types";
import { Terminal, Cpu, Database, Cloud, Code } from "lucide-react";

export function TechTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-12 text-[#334155] bg-white min-h-[1120px] font-sans selection:bg-[#0f172a] selection:text-white">
      {/* Header */}
      <header className="mb-14 flex items-start justify-between border-b-2 border-[#e2e8f0] pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#0f172a]">
            <Code className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Technical Portfolio</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-[#0f172a] tracking-tight leading-none">
            {data.personalDetails.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-sm font-bold text-[#64748b] uppercase tracking-widest">{data.targetJobRole || 'Software Engineer'}</p>
        </div>
        <div className="text-[9px] font-bold text-[#64748b] uppercase text-right space-y-1.5 pt-4">
          {data.personalDetails.email && <div>{data.personalDetails.email}</div>}
          {data.personalDetails.phone && <div>{data.personalDetails.phone}</div>}
          {data.personalDetails.portfolio && <div className="text-[#0f172a]">{data.personalDetails.portfolio}</div>}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-12">
        {/* Main Content Column */}
        <div className="col-span-8 space-y-12">
          {data.summary && (
            <section>
              <h2 className="text-[11px] font-black text-[#0f172a] uppercase mb-4 tracking-widest border-l-4 border-[#0f172a] pl-3">Profile Summary</h2>
              <p className="text-xs text-[#475569] leading-relaxed font-medium">
                {data.summary}
              </p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black text-[#0f172a] uppercase mb-8 tracking-widest border-l-4 border-[#0f172a] pl-3">Professional Experience</h2>
              <div className="space-y-10">
                {data.experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-tight">{exp.role}</h3>
                      <span className="text-[9px] font-bold text-[#94a3b8] uppercase">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#64748b] mb-3 uppercase flex items-center gap-2">
                      {exp.company}
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed whitespace-pre-line font-medium border-l-[1px] border-[#f1f5f9] pl-5">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black text-[#0f172a] uppercase mb-8 tracking-widest border-l-4 border-[#0f172a] pl-3">Academic & Personal Projects</h2>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] hover:bg-white transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[11px] font-bold text-[#0f172a] uppercase">{project.name}</h3>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                          {project.technologies.slice(0, 4).map((t, ti) => (
                          <span key={ti} className="text-[7px] font-bold bg-white border border-[#e2e8f0] px-1.5 py-0.5 rounded text-[#64748b] uppercase">{t}</span>
                          ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#64748b] leading-relaxed font-medium">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-4 space-y-12">
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black text-[#0f172a] uppercase mb-6 tracking-widest">Technical Toolkit</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-[9px] font-bold text-[#475569] bg-[#f1f5f9] px-3 py-1.5 rounded uppercase tracking-tighter">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black text-[#0f172a] uppercase mb-6 tracking-widest">Educational Foundation</h2>
              <div className="space-y-8">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-bold text-[#334155] uppercase leading-snug">{edu.degree}</div>
                    <div className="text-[9px] text-[#64748b] font-bold mt-1 uppercase tracking-tight">{edu.institution}</div>
                    <div className="text-[8px] font-bold text-[#bdc3c7] mt-1 italic">{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
