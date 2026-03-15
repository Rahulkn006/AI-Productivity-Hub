import { ResumeDetails } from "@/lib/resume-types";

export function CorporateTemplate({ data }: { data: ResumeDetails }) {
  // REBRANDED AS 'CLASSIC CORPORATE'
  return (
    <div className="p-16 text-[#1a1a1a] bg-white min-h-[1120px] font-serif shadow-sm">
      <header className="border-b-4 border-[#1a1a1a] pb-10 mb-12 text-center space-y-4">
        <h1 className="text-5xl font-bold uppercase tracking-wide leading-none">{data.personalDetails.fullName || 'PROFESSIONAL NAME'}</h1>
        <p className="text-sm font-bold text-[#4a4a4a] uppercase tracking-widest">{data.targetJobRole || 'Candidate for Entry Level Position'}</p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-[10px] font-bold text-[#666666] uppercase tracking-tighter pt-4">
          {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
          {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
          {data.personalDetails.linkedin && <span>LINKEDIN.COM/IN/PRESENCE</span>}
        </div>
      </header>

      <div className="space-y-12">
        {data.summary && (
          <section>
            <h2 className="text-[11px] font-black uppercase border-b border-[#cccccc] pb-1 mb-4 tracking-widest text-[#1a1a1a]">Professional Narrative</h2>
            <p className="text-sm leading-relaxed text-[#333333] italic text-center max-w-2xl mx-auto px-4">{data.summary}</p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-black uppercase border-b border-[#cccccc] pb-1 mb-6 tracking-widest text-[#1a1a1a]">Experience & Academic Training</h2>
            <div className="space-y-10">
              {data.experience.map((exp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-[#1a1a1a]">{exp.company}</h3>
                    <span className="text-[10px] font-bold text-[#999999]">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-bold text-[#64748b] uppercase italic mb-3">{exp.role}</div>
                  <p className="text-sm text-[#333333] leading-relaxed whitespace-pre-line border-l-2 border-[#f0f0f0] pl-6 ml-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-16">
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase border-b border-[#cccccc] pb-1 mb-6 tracking-widest text-[#1a1a1a]">Core Competencies</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {data.skills.map((skill, i) => (
                  <div key={i} className="text-xs font-bold text-[#444444] flex items-center gap-3">
                    <span className="text-[#cccccc] text-[8px] opacity-40">■</span> {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase border-b border-[#cccccc] pb-1 mb-6 tracking-widest text-[#1a1a1a]">Education History</h2>
              <div className="space-y-6">
                  {data.education.map((edu, i) => (
                  <div key={i} className="space-y-1">
                      <h3 className="font-bold text-sm text-[#1a1a1a] leading-tight">{edu.institution}</h3>
                      <p className="text-[11px] text-[#666666] font-bold uppercase italic">{edu.degree}</p>
                      <div className="text-[10px] text-[#bbbbbb] italic font-bold">{edu.endDate}</div>
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
