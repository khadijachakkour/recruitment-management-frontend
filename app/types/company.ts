export type Department = {
  id: number;
  name: string;
  company_id: number;
};

export type Company = {
  id: number;
  companyName: string;
  companyLogo?: string;
  industry: string;
  otherIndustry?: string;
  companyDescription: string;
  companyAddress: string;
  country: string;
  region: string;
  yearFounded: string;
  companySize: string;
  numberOfEmployees: string;
  contractTypes: string;
  requiredDocuments: string;
  contactEmail: string;
  phoneNumber: string;
  website?: string;
  socialLinks?: string;
  user_id: string;
  ceo?: string;
  ceoImage?: string;
  revenue?: number;
  verified?: boolean;
  departments?: Department[];
};
