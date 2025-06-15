// Base interfaces for common properties
interface BaseProfileDTO {
  id: number;
  name: string;
  country: string;
  logo: string;
  profilePhoto: string;
  location: string;
  links: LinkDTO[];
  attachments: AttachmentDTO[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinkDTO {
  id: number;
  title: string;
  url: string;
  type: string;
}

export interface AttachmentDTO {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface SocialLinkDTO {
  platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK' | 'TWITTER';
  url: string;
}

// Profile list item DTO
export interface ProfileListItemDTO {
  userId: number;
  tradeName: string;
  logoUrl: string;
  country: string;
  sector: string;
}

// Brand profile DTO
export interface BrandProfileDTO extends BaseProfileDTO {
  sector: string;
  description: string;
  websiteUrl: string;
}

// Influencer profile DTO
export interface InfluencerProfileDTO extends BaseProfileDTO {
  niches: string[];
  bio: string;
  followers: number;
  socialLinks: SocialLinkDTO[];
} 