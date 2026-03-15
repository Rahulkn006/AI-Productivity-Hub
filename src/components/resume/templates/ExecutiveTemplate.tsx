import { ResumeDetails } from "@/lib/resume-types";

export function ExecutiveTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-16 text-[#1e293b] bg-white min-h-[1120px] font-serif selection:bg-[#0f172a] selection:text-white">
      {/* Header */}
      <header className="mb-20 text-center space-y-4">
        <h1 className="text-4xl font-light tracking-[0.25em] text-[#0f172a] uppercase leading-none">
          {data.personalDetails.fullName || 'YOUR FULL NAME'}
        </h1>
        <div className="w-16 h-[2px] bg-[#0f172a] mx-auto opacity-20" />
        <p className="text-xs font-bold text-[#64748b] tracking-[0.4em] uppercase pt-2">
          {data.targetJobRole || 'Candidate for Professional Excellence'}
        </p>
        <div className="flex justify-center gap-6 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider pt-6">
          {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
          {data.personalDetails.phone && <span className="opacity-30">|</span>}
          {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
          {data.personalDetails.linkedin && <span className="opacity-30">|</span>}
          {data.personalDetails.linkedin && <span>LINKEDIN</span>}
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-16">
        {data.summary && (
          <section className="text-center">
            <h2 className="text-[9px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.5em] opacity-40">Professional Core</h2>
            <p className="text-base font-light leading-relaxed text-[#475569] italic">
              "{data.summary}"
            </p>
          </section>
        )}

        {/* Experience or Projects should be prominent */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-[9px] font-black uppercase text-[#0f172a] mb-8 tracking-[0.5em] border-b border-[#f1f5f9] pb-2 text-center">Relevant Experience</h2>
            <div className="space-y-12">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center items-baseline gap-4 mb-2">
                    <h3 className="text-lg font-bold text-[#0f172a] tracking-tight">{exp.role}</h3>
                    <span className="text-[10px] font-bold text-[#bdc3c7] uppercase italic">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.2em] mb-4">{exp.company}</div>
                  <p className="text-sm text-[#475569] leading-relaxed font-light max-w-2xl mx-auto text-justify whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-16">
          {data.education && data.education.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-[9px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.5em] border-b border-[#f1f5f9] pb-2">Academic Profile</h2>
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-[#1e293b]">{edu.degree}</h3>
                  <p className="text-[11px] text-[#94a3b8] font-bold uppercase mt-1 tracking-tight">{edu.institution}</p>
                  <p className="text-[9px] text-[#bdc3c7] font-bold mt-1 italic">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-[9px] font-black uppercase text-[#0f172a] mb-6 tracking-[0.5em] border-b border-[#f1f5f9] pb-2">Expertise</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {data.skills.map((skill, i) => (
                  <div key={i} className="text-[11px] font-bold text-[#475569] uppercase tracking-tighter border-b-2 border-[#f8fafc]">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
