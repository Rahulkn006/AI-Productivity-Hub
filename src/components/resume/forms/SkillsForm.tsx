import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, X, Plus, Terminal } from "lucide-react";
import { useState } from "react";

export function SkillsForm() {
  const { data, updateSkills } = useResumeStore();
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !data.skills.includes(trimmedSkill)) {
      updateSkills([...data.skills, trimmedSkill]);
    }
    setInputValue("");
  };

  const removeSkill = (skillToRemove: string) => {
    updateSkills(data.skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-4 h-4 text-indigo-500" />
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Skills & Expertise</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[9px] font-bold uppercase text-slate-500">Add Skill</Label>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. React, TypeScript, AWS"
              className="h-10 text-xs font-bold rounded-xl"
            />
            <Button 
                onClick={() => addSkill(inputValue)}
                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
                <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[8px] text-slate-400 font-medium italic uppercase mt-1">Press Enter or use a comma to add multiple skills quickly.</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {data.skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 group hover:border-indigo-300 dark:hover:border-indigo-900 transition-colors"
            >
              {skill}
              <button 
                onClick={() => removeSkill(skill)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {data.skills.length === 0 && (
            <div className="w-full text-center py-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-100 dark:border-slate-800">
               No skills added yet.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
