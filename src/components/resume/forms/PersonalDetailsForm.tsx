import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, Linkedin, Globe } from "lucide-react";

export function PersonalDetailsForm() {
  const { data, updatePersonalDetails } = useResumeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonalDetails({ [name]: value });
  };

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-4 h-4 text-indigo-500" />
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Personal Details</h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
          <Input
            name="fullName"
            value={data.personalDetails.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
            <Input
              name="email"
              type="email"
              value={data.personalDetails.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</Label>
            <Input
              name="phone"
              value={data.personalDetails.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LinkedIn URL</Label>
          <div className="relative">
             <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input
                name="linkedin"
                value={data.personalDetails.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/johndoe"
                className="h-11 pl-10 rounded-xl"
             />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Portfolio / Website</Label>
          <div className="relative">
             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input
                name="portfolio"
                value={data.personalDetails.portfolio}
                onChange={handleChange}
                placeholder="johndoe.com"
                className="h-11 pl-10 rounded-xl"
             />
          </div>
        </div>
      </div>
    </Card>
  );
}
