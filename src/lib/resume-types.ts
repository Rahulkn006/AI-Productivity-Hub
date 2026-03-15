export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
}

export interface ResumeDetails {
  personalDetails: PersonalDetails;
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  summary?: string;
  targetJobRole: string;
  atsScore?: {
    score: number;
    missingKeywords: string[];
    formattingSuggestions: string[];
    contentSuggestions: string[];
  };
  activeTemplate: ResumeTemplate;
}

export type ResumeTemplate = 'modern' | 'minimal' | 'corporate' | 'creative' | 'tech' | 'healthcare' | 'finance' | 'executive' | 'intern' | 'sidebar' | 'grid' | 'elegant';

export const initialResumeState: ResumeDetails = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: ''
  },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  targetJobRole: '',
  atsScore: undefined,
  activeTemplate: 'modern'
};
