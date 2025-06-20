export interface InfluencerProfileVO {
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  contact_email: string;
  niche: string;
  followers: { instagram: number; tiktok: number; youtube: number };
  rate_per_post: number;
  engagement_rate?: number;
  main_audience?: string;
  languages?: string;
  social_links?: Record<string, string>;
  portfolio_urls?: string[];
  previous_experience?: string;
  preferred_categories?: string;
}
