import { ResumeDetails } from "@/lib/resume-types";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function SidebarCleanTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="flex min-h-[1120px] bg-white font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-[280px] bg-slate-50 p-10 border-r border-slate-100 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
            {data.personalDetails.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {data.targetJobRole || 'Professional Role'}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Contact</h2>
          <div className="space-y-3">
            {data.personalDetails.email && (
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="break-all">{data.personalDetails.email}</span>
              </div>
            )}
            {data.personalDetails.phone && (
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.personalDetails.phone}</span>
              </div>
            )}
            {data.personalDetails.location && (
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.personalDetails.location}</span>
              </div>
            )}
            {data.personalDetails.linkedin && (
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                <span>LinkedIn</span>
              </div>
            )}
          </div>
        </section>

        {data.skills && data.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium lowercase italic">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section className="space-y-4 mt-auto">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[11px] font-bold text-slate-800">{edu.degree}</div>
                <div className="text-[10px] text-slate-500">{edu.institution}</div>
                <div className="text-[9px] text-slate-400 italic">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 bg-white flex flex-col gap-10">
        {data.summary && (
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
               Professional Narrative
               <div className="h-[1px] flex-1 bg-slate-100" />
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              {data.summary}
            </p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
               Experience Portfolio
               <div className="h-[1px] flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{exp.company}</div>
                  <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
               Selected Projects
               <div className="h-[1px] flex-1 bg-slate-100" />
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {data.projects.map((project, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900 uppercase">{project.name}</h3>
                    <div className="flex gap-1.5">
                      {project.technologies.map((tech, ti) => (
                        <span key={ti} className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
