import { ResumeDetails } from "@/lib/resume-types";
import { Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";

export function ModernTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-10 text-[#1e293b] bg-white min-h-[1120px] font-sans">
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-start gap-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-[#0f172a] mb-2 leading-tight">
            {data.personalDetails.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#64748b] uppercase italic">
            {data.targetJobRole || 'Professional Role'}
          </p>
        </div>
        <div className="text-right space-y-1 pt-1">
          {data.personalDetails.email && (
            <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-[#475569]">
               {data.personalDetails.email} <Mail className="w-3 h-3" />
            </div>
          )}
          {data.personalDetails.phone && (
            <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-[#475569]">
               {data.personalDetails.phone} <Phone className="w-3 h-3" />
            </div>
          )}
          {data.personalDetails.linkedin && (
            <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-[#475569]">
               LINKEDIN <Linkedin className="w-3 h-3" />
            </div>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-10">
          {/* Summary */}
          {data.summary && (
            <section>
              <h2 className="text-sm font-bold uppercase text-[#0f172a] mb-3 border-b border-[#e2e8f0] pb-1">Professional Summary</h2>
              <p className="text-xs leading-relaxed text-[#475569] font-medium">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-[#0f172a] mb-4 border-b border-[#e2e8f0] pb-1">Work Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-[#f1f5f9]">
                    <div className="absolute -left-[1.5px] top-0 w-[3px] h-4 bg-[#0f172a]" />
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-[#0f172a] uppercase">{exp.role}</h3>
                      <span className="text-[9px] font-bold text-[#94a3b8]">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#64748b] mb-2 uppercase tracking-wide">{exp.company}</div>
                    <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line font-medium">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.2em] border-b-2 border-[#0f172a] block pb-1">Selected Projects</h2>
              <div className="grid grid-cols-1 gap-6">
                {data.projects.map((project, i) => (
                  <div key={i} className="p-5 bg-[#f8fafc] rounded-lg border border-[#f1f5f9]">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-tight">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.technologies.map((tech, ti) => (
                          <span key={ti} className="text-[8px] font-black text-[#64748b] bg-white border border-[#e2e8f0] px-1.5 py-0.5 rounded uppercase">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed font-medium">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-10">
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.2em] border-b-2 border-[#0f172a] block pb-1">Stack</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-[9px] font-black text-[#475569] border border-[#e2e8f0] px-2.5 py-1.5 rounded-md uppercase tracking-tighter bg-[#f8fafc]">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.2em] border-b-2 border-[#0f172a] block pb-1">Foundation</h2>
              <div className="space-y-6">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-black text-xs text-[#0f172a] uppercase">{edu.degree}</h3>
                    <div className="text-[9px] text-[#64748b] font-bold mt-1 uppercase leading-tight">{edu.institution}</div>
                    <div className="text-[9px] text-[#94a3b8] italic mt-1 font-bold">{edu.startDate} - {edu.endDate}</div>
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
