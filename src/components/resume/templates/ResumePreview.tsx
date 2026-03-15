import { ResumeDetails } from "@/lib/resume-types";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { TechTemplate } from "./TechTemplate";
import { HealthcareTemplate } from "./HealthcareTemplate";
import { FinanceTemplate } from "./FinanceTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";

import { InternTemplate } from "./InternTemplate";
import { SidebarCleanTemplate } from "./SidebarCleanTemplate";
import { GridProfessionalTemplate } from "./GridProfessionalTemplate";
import { ElegantSerifTemplate } from "./ElegantSerifTemplate";

interface ResumePreviewProps {
  data: ResumeDetails;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (data.activeTemplate) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'corporate': return <CorporateTemplate data={data} />;
      case 'creative': return <CreativeTemplate data={data} />;
      case 'tech': return <TechTemplate data={data} />;
      case 'healthcare': return <HealthcareTemplate data={data} />;
      case 'finance': return <FinanceTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'intern': return <InternTemplate data={data} />;
      case 'sidebar': return <SidebarCleanTemplate data={data} />;
      case 'grid': return <GridProfessionalTemplate data={data} />;
      case 'elegant': return <ElegantSerifTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <div id="resume-preview" className="w-full bg-white shadow-2xl origin-top transition-transform">
      {renderTemplate()}
    </div>
  );
}
