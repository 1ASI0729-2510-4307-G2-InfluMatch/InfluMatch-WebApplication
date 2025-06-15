export interface SocialLink {
  platform: string;
  url: string;
}

export interface Link {
  title: string;
  url: string;
}

export interface Attachment {
  title: string;
  description: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  data: string;
}

export interface InfluencerProfileResponse {
  id: number;
  name: string;
  niches: string[];
  bio: string;
  country: string;
  photo: string;
  profilePhoto: string;
  followers: number;
  socialLinks: SocialLink[];
  location: string;
  links: Link[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfileResponse {
  id: number;
  name: string;
  sector: string;
  country: string;
  description: string;
  logo: string;
  profilePhoto: string;
  websiteUrl: string;
  location: string;
  links: Link[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}
