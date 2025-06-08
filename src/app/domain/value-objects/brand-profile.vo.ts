export interface BrandProfileVO {
  companyName: string;
  description?: string;
  industry?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export interface BrandProfileResponseVO {
  id: number;
  userId: number;
  companyName: string;
  description: string;
  industry: string;
  websiteUrl: string;
  logoUrl: string;
  message: string;
}
