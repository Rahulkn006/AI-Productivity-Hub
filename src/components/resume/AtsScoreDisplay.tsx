import { ResumeDetails } from "@/lib/resume-types";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Sparkles, Filter, Layout, List } from "lucide-react";
import { motion } from "framer-motion";

export function AtsScoreDisplay({ score }: { score: ResumeDetails['atsScore'] }) {
  if (!score) return null;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30";
    if (s >= 60) return "bg-amber-50/50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30";
    return "bg-rose-50/50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/30";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className={`p-8 border-2 ${getScoreBg(score.score)} overflow-hidden relative`}>
        <div className="absolute -right-8 -bottom-8 opacity-5">
           <Filter className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 44}
                initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - score.score / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={getScoreColor(score.score)}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-black ${getScoreColor(score.score)}`}>
              {score.score}
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">ATS Match Score</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[200px]">How well your resume matches the target job description.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Keywords */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 text-rose-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.map((keyword, i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-lg border border-rose-100 dark:border-rose-900/30 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" /> {keyword}
              </span>
            ))}
          </div>
        </section>

        {/* Content/Formatting Suggestions */}
        <section className="space-y-3">
           <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Optimizations</h4>
          </div>
          <div className="space-y-2">
             {[...score.contentSuggestions, ...score.formattingSuggestions].slice(0, 4).map((suggestion, i) => (
               <div key={i} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{suggestion}</p>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
