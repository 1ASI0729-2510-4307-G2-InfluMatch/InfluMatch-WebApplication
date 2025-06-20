// Base interfaces for common properties
interface BaseProfile {
  id: number;
  name: string;
  country: string;
  logo: string;
  profilePhoto: string;
  location: string;
  links: Link[];
  attachments: Attachment[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  type: string;
}

export interface Attachment {
  id: number;
  title: string;
  description?: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  data: string; // base64 data
  size?: number;
}

export interface SocialLink {
  platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK' | 'TWITTER';
  url: string;
}

// Profile list item model
export interface ProfileListItem {
  userId: number;
  tradeName: string;
  logoUrl: string;
  country: string;
  sector: string;
}

// Brand profile model
export interface BrandProfile extends BaseProfile {
  sector: string;
  description: string;
  websiteUrl: string;
}

// Influencer profile model
export interface InfluencerProfile extends BaseProfile {
  niches: string[];
  bio: string;
  followers: number;
  socialLinks: SocialLink[];
} 