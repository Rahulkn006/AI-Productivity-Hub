import { ResumeDetails } from "@/lib/resume-types";

export function MinimalTemplate({ data }: { data: ResumeDetails }) {
  // REDESIGNED AS 'INVISIBLE MINIMAL'
  return (
    <div className="p-20 text-[#212121] bg-white min-h-[1120px] font-sans selection:bg-[#000000] selection:text-white">
      <header className="mb-24 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-5xl font-medium tracking-tight text-[#000000]">{data.personalDetails.fullName || 'YOUR NAME'}</h1>
          <p className="text-sm font-semibold text-[#888888] uppercase tracking-[0.1em]">{data.targetJobRole || 'Aspiring Professional'}</p>
        </div>
        <div className="text-right space-y-1 pt-2">
          {data.personalDetails.email && <div className="text-[10px] font-medium text-[#666666]">{data.personalDetails.email}</div>}
          {data.personalDetails.phone && <div className="text-[10px] font-medium text-[#666666]">{data.personalDetails.phone}</div>}
        </div>
      </header>

      <div className="space-y-24 max-w-4xl mx-auto">
        {data.summary && (
          <section className="grid grid-cols-12 gap-10">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc] pt-1">Profile</h2>
            <div className="col-span-9">
               <p className="text-lg font-light leading-relaxed text-[#444444] border-l-[1px] border-[#f0f0f0] pl-10">
                 {data.summary}
               </p>
            </div>
          </section>
        )}

        {((data.experience && data.experience.length > 0) || (data.education && data.education.length > 0)) && (
          <section className="grid grid-cols-12 gap-10">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc] pt-1">Background</h2>
            <div className="col-span-9 space-y-16">
              {data.experience && data.experience.length > 0 && (
                <div className="space-y-10">
                    {data.experience.map((exp, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-2xl font-medium text-[#000000] tracking-tight">{exp.role}</h3>
                        <span className="text-[10px] font-bold text-[#e0e0e0] uppercase">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="text-[11px] font-bold text-[#999999] uppercase tracking-widest mb-6">{exp.company}</div>
                        <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-line font-light pr-10">
                            {exp.description}
                        </p>
                    </div>
                    ))}
                </div>
              )}

              {data.education && data.education.length > 0 && (
                <div className="space-y-10 border-t border-[#f8f8f8] pt-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc] mb-8">Education</h2>
                    {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-baseline">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-[#000000]">{edu.degree}</h3>
                            <p className="text-[11px] text-[#999999] font-bold uppercase tracking-tight">{edu.institution}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#e0e0e0] uppercase">{edu.endDate}</span>
                    </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section className="grid grid-cols-12 gap-10">
            <h2 className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc] pt-1">Toolkit</h2>
            <div className="col-span-9">
               <div className="grid grid-cols-3 gap-y-6">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="text-xs font-medium text-[#444444] uppercase tracking-tight">
                      {skill}
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
