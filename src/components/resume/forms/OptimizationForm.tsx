import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Target, Wand2 } from "lucide-react";

interface OptimizationFormProps {
  onOptimize: () => void;
  isLoading: boolean;
}

export function OptimizationForm({ onOptimize, isLoading }: OptimizationFormProps) {
  const { data, updateTargetJobRole } = useResumeStore();

  return (
    <Card className="p-8 border-2 border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-500/5 dark:to-slate-950 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <Sparkles className="w-24 h-24 text-indigo-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-tighter">AI Resume Tailoring</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Define your target role</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Target Job Role</Label>
            <Input
              value={data.targetJobRole}
              onChange={(e) => updateTargetJobRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="h-12 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 bg-white dark:bg-slate-900 rounded-xl font-bold text-slate-700 dark:text-slate-200"
            />
            <p className="text-[9px] text-slate-400 font-medium">The AI uses this to optimize your bullet points and calculate your ATS score.</p>
          </div>

          <Button 
            onClick={onOptimize} 
            disabled={isLoading || !data.targetJobRole}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tailoring Content...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Optimize with AI
              </>
            )}
          </Button>

          {!data.atsScore && !isLoading && (
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
               <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />
               <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase leading-relaxed">Optimization Pending: Click the button above to generate your first ATS score.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
