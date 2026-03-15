import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, Trash2, GripVertical } from "lucide-react";

export function ExperienceForm() {
  const { data, updateExperience } = useResumeStore();

  const addExperience = () => {
    const newExp = {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    updateExperience([...data.experience, newExp]);
  };

  const removeExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    updateExperience(newExperience);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    updateExperience(newExperience);
  };

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Work Experience</h3>
        </div>
        <Button onClick={addExperience} variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-wider rounded-lg px-3">
          <Plus className="w-3 h-3 mr-1" /> Add Job
        </Button>
      </div>

      <div className="space-y-8">
        {data.experience.map((exp, index) => (
          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group animate-in slide-in-from-right-2 duration-300">
            <button 
              onClick={() => removeExperience(index)}
              className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="h-10 text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Role</Label>
                <Input
                  value={exp.role}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                  placeholder="e.g. Senior Developer"
                  className="h-10 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Start Date</Label>
                <Input
                  value={exp.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  placeholder="Mar 2021"
                  className="h-10 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">End Date</Label>
                <Input
                  value={exp.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                  placeholder="Present"
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-bold uppercase text-slate-500">Description / Responsibilities</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                placeholder="Briefly describe your impact..."
                className="min-h-[100px] text-xs leading-relaxed resize-none"
              />
              <p className="text-[8px] text-slate-400 font-medium italic uppercase">TIP: Use "Optimize with AI" to transform this into high-impact bullet points later.</p>
            </div>
          </div>
        ))}

        {data.experience.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
             <Briefcase className="w-8 h-8 text-slate-200 mx-auto mb-3" />
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No work history added yet.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
