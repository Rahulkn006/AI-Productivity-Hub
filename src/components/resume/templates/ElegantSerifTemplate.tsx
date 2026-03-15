import { ResumeDetails } from "@/lib/resume-types";

export function ElegantSerifTemplate({ data }: { data: ResumeDetails }) {
  return (
    <div className="p-20 text-[#2c3e50] bg-white min-h-[1120px] font-serif selection:bg-[#2c3e50] selection:text-white">
      <header className="mb-24 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extralight tracking-[0.1em] text-[#1a252f] mb-4 uppercase">
          {data.personalDetails.fullName || 'PROFESSIONAL NAME'}
        </h1>
        <div className="w-40 h-[1px] bg-[#e5e7eb] mb-6" />
        <p className="text-xs font-medium text-[#7f8c8d] uppercase tracking-[0.4em]">
          {data.targetJobRole || 'Candidate for Entry Level Professional'}
        </p>
        <div className="flex justify-center gap-10 text-[9px] font-bold text-[#95a5a6] uppercase tracking-widest pt-10">
          {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
          {data.personalDetails.phone && <span className="opacity-30">|</span>}
          {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-20 px-8">
        {data.summary && (
          <section>
            <h2 className="text-[10px] font-bold uppercase text-[#1a252f] mb-8 tracking-[0.5em] text-center border-b border-[#f4f4f4] pb-2">Professional Summary</h2>
            <p className="text-lg font-light leading-relaxed text-[#5e6a71] text-justify first-letter:text-4xl first-letter:font-light first-letter:mr-2 first-letter:float-left first-letter:leading-none">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-8 space-y-16">
            {data.experience && data.experience.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase text-[#1a252f] mb-10 tracking-[0.5em] border-b border-[#f4f4f4] pb-2">Experience</h2>
                <div className="space-y-12">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-3">
                        <h3 className="text-xl font-medium text-[#1a252f] tracking-tight">{exp.role}</h3>
                        <span className="text-[9px] font-bold text-[#bdc3c7] uppercase">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-[10px] font-bold text-[#95a5a6] uppercase tracking-widest mb-4 italic px-2 border-l-[1px] border-[#e5e7eb]">{exp.company}</div>
                      <p className="text-sm text-[#5e6a71] leading-relaxed font-light text-justify pl-2">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects && data.projects.length > 0 && (
              <section>
                 <h2 className="text-[10px] font-bold uppercase text-[#1a252f] mb-10 tracking-[0.5em] border-b border-[#f4f4f4] pb-2">Project Portfolio</h2>
                 <div className="space-y-8">
                   {data.projects.map((project, i) => (
                     <div key={i} className="group">
                       <h3 className="text-sm font-bold text-[#1a252f] mb-2 uppercase tracking-tight group-hover:underline">{project.name}</h3>
                       <p className="text-xs text-[#7f8c8d] leading-relaxed font-light">{project.description}</p>
                     </div>
                   ))}
                 </div>
              </section>
            )}
          </div>

          <div className="col-span-4 space-y-16">
            {data.education && data.education.length > 0 && (
              <section>
                 <h2 className="text-[10px] font-bold uppercase text-[#1a252f] mb-10 tracking-[0.5em] border-b border-[#f4f4f4] pb-2 text-right">Academics</h2>
                 <div className="space-y-10 text-right">
                   {data.education.map((edu, i) => (
                     <div key={i}>
                       <h3 className="text-sm font-bold text-[#1a252f] tracking-tight leading-snug">{edu.degree}</h3>
                       <p className="text-[10px] text-[#95a5a6] font-bold uppercase mt-1.5">{edu.institution}</p>
                       <p className="text-[8px] text-[#bdc3c7] font-black mt-1 italic tracking-widest">{edu.endDate}</p>
                     </div>
                   ))}
                 </div>
              </section>
            )}

            {data.skills && data.skills.length > 0 && (
              <section>
                 <h2 className="text-[10px] font-bold uppercase text-[#1a252f] mb-10 tracking-[0.5em] border-b border-[#f4f4f4] pb-2 text-right">Competencies</h2>
                 <div className="flex flex-col gap-4 text-right">
                   {data.skills.map((skill, i) => (
                     <div key={i} className="text-[11px] font-medium text-[#7f8c8d] uppercase border-b border-[#f4f4f4] pb-1">
                       {skill}
                     </div>
                   ))}
                 </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
