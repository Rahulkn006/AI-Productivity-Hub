"use client";

import { useResumeStore } from "@/lib/resume-store";
import { ResumePreview } from "./templates/ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { AtsScoreDisplay } from "./AtsScoreDisplay";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { OptimizationForm } from "./forms/OptimizationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Sparkles, Download, RotateCcw, Layout, User, Briefcase, GraduationCap, Palette, Settings } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export function ResumeClient() {
  const { data, reset, setAllData, updateAtsScore } = useResumeStore();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      reset();
      toast.success("Resume data reset.");
    }
  };

  const handleOptimize = async () => {
    if (!data.targetJobRole) {
      toast.error("Please specify a Target Job Role first.");
      setActiveTab("optimize");
      return;
    }

    setIsOptimizing(true);
    toast.info("AI is analyzing your resume and targeting it for the role...");

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: data }),
      });

      if (!response.ok) throw new Error("Optimization failed");

      const result = await response.json();
      
      // Update state with AI optimized content
      setAllData({
        ...data,
        summary: result.summary,
        experience: result.optimizedExperience,
        projects: result.optimizedProjects,
        atsScore: result.atsScore
      });

      toast.success("Resume optimized successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize resume with AI.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    // Dynamically import html2pdf only on the client side
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0,
      filename: `${data.personalDetails.fullName || 'Resume'}_${data.activeTemplate}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    toast.info("Generating your PDF...");
    html2pdf().from(element).set(opt).save().then(() => {
        toast.success("Resume downloaded!");
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)]">
      {/* Editor Side */}
      <div className="lg:col-span-5 h-full flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
               <FileText className="w-5 h-5" />
             </div>
             <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Editor</h2>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={handleReset} className="h-8 text-[10px] font-bold uppercase tracking-widest">
               <RotateCcw className="w-3 h-3 mr-1" /> Reset
             </Button>
             <Button size="sm" onClick={handleDownload} className="h-8 bg-black hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-4">
               <Download className="w-3 h-3 mr-1" /> PDF
             </Button>
           </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 mb-4 h-12">
            <TabsTrigger value="personal" className="flex-1 text-[10px] font-black uppercase"><User className="w-3 h-3 mr-1.5" /> Bio</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1 text-[10px] font-black uppercase"><Briefcase className="w-3 h-3 mr-1.5" /> Work</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 text-[10px] font-black uppercase"><GraduationCap className="w-3 h-3 mr-1.5" /> Skills</TabsTrigger>
            <TabsTrigger value="optimize" className="flex-1 text-[10px] font-black uppercase text-indigo-600"><Sparkles className="w-3 h-3 mr-1.5" /> AI</TabsTrigger>
            <TabsTrigger value="templates" className="flex-1 text-[10px] font-black uppercase"><Layout className="w-3 h-3 mr-1.5" /> Style</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="flex-1 overflow-y-auto pr-2 space-y-4 m-0">
             <PersonalDetailsForm />
          </TabsContent>

          <TabsContent value="experience" className="flex-1 overflow-y-auto pr-2 space-y-4 m-0">
             <ExperienceForm />
             <EducationForm />
          </TabsContent>

          <TabsContent value="skills" className="flex-1 overflow-y-auto pr-2 space-y-4 m-0">
             <SkillsForm />
             <ProjectsForm />
          </TabsContent>

          <TabsContent value="optimize" className="flex-1 overflow-y-auto pr-2 space-y-6 m-0">
             <OptimizationForm onOptimize={handleOptimize} isLoading={isOptimizing} />
             <AtsScoreDisplay score={data.atsScore} />
          </TabsContent>

          <TabsContent value="templates" className="flex-1 overflow-y-auto pr-2 space-y-4 m-0">
             <TemplateSelector />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Side */}
      <div className="lg:col-span-7 h-full bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 overflow-y-auto">
        <div className="max-w-[1120px] mx-auto scale-[0.85] origin-top shadow-2xl transition-all duration-500">
           <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}
