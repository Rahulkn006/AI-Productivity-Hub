import { ResumeDetails } from "@/lib/resume-types";

export function FinanceTemplate({ data }: { data: ResumeDetails }) {
  // REBRANDED AS 'PROFESSIONAL LEDGER'
  return (
    <div className="p-12 text-[#111827] bg-white min-h-[1120px] font-sans selection:bg-[#111827] selection:text-white">
      <header className="mb-20 grid grid-cols-12 gap-12 items-end">
        <div className="col-span-8 space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#111827] leading-none uppercase">
            {data.personalDetails.fullName || 'CANDIDATE NAME'}
          </h1>
          <p className="text-xs font-bold text-[#6b7280] tracking-[0.3em] uppercase">
            {data.targetJobRole || 'Aspiring Professional'}
          </p>
        </div>
        <div className="col-span-4 text-right space-y-1.5 text-[9px] font-bold text-[#9ca3af] uppercase">
          {data.personalDetails.email && <div>{data.personalDetails.email}</div>}
          {data.personalDetails.phone && <div>{data.personalDetails.phone}</div>}
          <div className="text-[#111827] pt-2">V.03 // {new Date().getFullYear()}</div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column (Details) */}
        <div className="col-span-4 space-y-12 pr-6 border-r border-[#f3f4f6]">
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#111827] mb-6 tracking-widest bg-[#f9fafb] p-2 text-center rounded">Capabilities</h2>
              <div className="flex flex-col gap-3">
                {data.skills.map((skill, i) => (
                  <div key={i} className="text-[10px] font-bold text-[#4b5563] uppercase border-b border-[#f9fafb] pb-1">
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#111827] mb-6 tracking-widest bg-[#f9fafb] p-2 text-center rounded">Education</h2>
              <div className="space-y-8">
                {data.education.map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="text-[10px] font-black text-[#111827] uppercase leading-tight">{edu.degree}</h3>
                    <div className="text-[9px] text-[#6b7280] font-bold uppercase tracking-tighter">{edu.institution}</div>
                    <div className="text-[8px] text-[#9ca3af] italic">{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Main) */}
        <div className="col-span-8 space-y-14">
          {data.summary && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#111827] mb-6 tracking-widest flex items-center gap-4">
                 Executive Summary <div className="h-[1px] flex-1 bg-[#f3f4f6]" />
              </h2>
              <p className="text-xs leading-relaxed text-[#4b5563] font-medium text-justify">
                {data.summary}
              </p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#111827] mb-8 tracking-widest flex items-center gap-4">
                 Professional Tenure <div className="h-[1px] flex-1 bg-[#f3f4f6]" />
              </h2>
              <div className="space-y-10">
                {data.experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-extrabold text-[#111827] text-sm uppercase">{exp.role}</h3>
                      <span className="text-[9px] font-black text-[#9ca3af] uppercase">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#6b7280] mb-4 uppercase italic">{exp.company}</div>
                    <p className="text-xs text-[#4b5563] leading-relaxed whitespace-pre-line font-medium text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase text-[#111827] mb-8 tracking-widest flex items-center gap-4">
                 Applied Initiatives <div className="h-[1px] flex-1 bg-[#f3f4f6]" />
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {data.projects.map((project, i) => (
                  <div key={i} className="p-5 bg-[#fcfcfc] border border-[#f3f4f6] rounded-xl hover:border-[#111827] transition-all">
                    <h3 className="text-[10px] font-black text-[#111827] uppercase mb-2 leading-none">{project.name}</h3>
                    <p className="text-[10px] text-[#6b7280] leading-relaxed font-medium line-clamp-3">{project.description}</p>
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
