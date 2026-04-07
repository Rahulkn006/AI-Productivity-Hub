import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Plus, Trash2, Link as LinkIcon, Box } from "lucide-react";

export function ProjectsForm() {
  const { data, updateProjects } = useResumeStore();

  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: [],
      link: "",
    };
    updateProjects([...data.projects, newProject]);
  };

  const removeProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    updateProjects(newProjects);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateProjects(newProjects);
  };

  const handleTechChange = (index: number, value: string) => {
    const techs = value.split(",").map(t => t.trim()).filter(t => t !== "");
    handleChange(index, "technologies", techs);
  };

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Key Projects</h3>
        </div>
        <Button onClick={addProject} variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-wider rounded-lg px-3">
          <Plus className="w-3 h-3 mr-1" /> Add Project
        </Button>
      </div>

      <div className="space-y-6">
        {data.projects.map((project, index) => (
          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group animate-in slide-in-from-bottom-2 duration-300">
            <button 
              onClick={() => removeProject(index)}
              className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  placeholder="e.g. AI SaaS Platform"
                  className="h-10 text-xs font-bold"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase text-slate-500">Project Link (Optional)</Label>
                <div className="relative">
                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                   <Input
                      value={project.link}
                      onChange={(e) => handleChange(index, "link", e.target.value)}
                      placeholder="github.com/..."
                      className="h-10 pl-9 text-xs"
                      autoComplete="off"
                   />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label className="text-[9px] font-bold uppercase text-slate-500">Technologies (Comma separated)</Label>
              <Input
                value={project.technologies.join(", ")}
                onChange={(e) => handleTechChange(index, e.target.value)}
                placeholder="React, Next.js, Supabase"
                className="h-10 text-xs font-medium"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-bold uppercase text-slate-500">Project Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                placeholder="What did you build and which problems did you solve?"
                className="min-h-[80px] text-xs leading-relaxed resize-none"
              />
            </div>
          </div>
        ))}
        
        {data.projects.length === 0 && (
          <div className="text-center py-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
             Share your best projects here.
          </div>
        )}
      </div>
    </Card>
  );
}
