import { useResumeStore } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Columns, LayoutDashboard, Building, Heart, Landmark, User, Zap, Palette } from "lucide-react";

const TEMPLATES = [
  { id: 'modern', name: 'Modern Clean', category: 'General', icon: LayoutDashboard },
  { id: 'minimal', name: 'Invisible', category: 'Minimalist', icon: Columns },
  { id: 'corporate', name: 'Classic Corporate', category: 'Professional', icon: Building },
  { id: 'creative', name: 'Minimal Creative', category: 'Creative', icon: Palette },
  { id: 'tech', name: 'Developer Minimal', category: 'Technical', icon: Zap },
  { id: 'healthcare', name: 'Scholar Minimal', category: 'Academic', icon: Heart },
  { id: 'finance', name: 'Professional Ledger', category: 'Business', icon: Landmark },
  { id: 'executive', name: 'Elite Professional', category: 'High-End', icon: User },
  { id: 'intern', name: 'Early Career', category: 'Internship', icon: LayoutDashboard },
  { id: 'sidebar', name: 'Sidebar Clean', category: 'Modern', icon: Columns },
  { id: 'grid', name: 'Structured Grid', category: 'organized', icon: LayoutDashboard },
  { id: 'elegant', name: 'Elegant Serif', category: 'Premium', icon: User },
] as const;

export function TemplateSelector() {
  const { data, updateActiveTemplate } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Select Style</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase">12 Premium Styles</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => updateActiveTemplate(template.id as any)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group relative overflow-hidden ${
              data.activeTemplate === template.id
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10'
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900'
            }`}
          >
            {data.activeTemplate === template.id && (
              <div className="absolute top-2 right-2 p-1 bg-indigo-500 rounded-full text-white">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
            <template.icon className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${
              data.activeTemplate === template.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
            }`} />
            <span className={`text-xs font-bold ${
              data.activeTemplate === template.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-400'
            }`}>
              {template.name}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase mt-1">
              {template.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
