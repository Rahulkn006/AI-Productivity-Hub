import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export function EducationForm() {
  const { data, updateEducation } = useResumeStore();

  const addEducation = () => {
    const newEdu = {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    };
    updateEducation([...data.education, newEdu]);
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    updateEducation(newEducation);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    updateEducation(newEducation);
  };

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Education</h3>
        </div>
        <Button onClick={addEducation} variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-wider rounded-lg px-3">
          <Plus className="w-3 h-3 mr-1" /> Add Degree
        </Button>
      </div>

      <div className="space-y-6">
        {data.education.map((edu, index) => (
          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group animate-in scale-in-95 duration-200">
            <button 
              onClick={() => removeEducation(index)}
              className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => handleChange(index, "institution", e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="h-10 text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  placeholder="e.g. BS Computer Science"
                  className="h-10 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  placeholder="2018"
                  className="h-10 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">End Date</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                  placeholder="2022"
                  className="h-10 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">GPA (Optional)</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => handleChange(index, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                  className="h-10 text-xs"
                />
              </div>
            </div>
          </div>
        ))}
        
        {data.education.length === 0 && (
          <div className="text-center py-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
             No education details added.
          </div>
        )}
      </div>
    </Card>
  );
}
