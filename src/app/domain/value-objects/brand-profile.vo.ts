export interface BrandProfileVO {
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  contact_email: string;
  sector: string;
  website?: string;
  budget_range: string;
  objectives: string;
  contact_name?: string;
  contact_position?: string;
  content_s?: string;
  influencer_s?: string;
  campaign_duration?: string;
  additional_info?: string;
  social_links?: Record<string, string>;
}
