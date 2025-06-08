export interface SocialLink {
  platform: 'IG' | 'YT' | 'TT' | 'FB' | 'TW' | 'LN' | 'OTHER';
  url: string;
}

export interface MediaAsset {
  url: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'DOC';
  title?: string;
  description?: string;
  sizeBytes?: number;
  metadata?: string;
}

export interface InfluencerProfileVO {
  displayName?: string;
  bio?: string;
  category?: string;
  country?: string;
  followersCount?: number;
  socialLinks?: SocialLink[];
  mediaAssets?: MediaAsset[];
}

export interface InfluencerProfileResponseVO {
  id: number;
  userId: number;
  displayName: string;
  bio: string;
  category: string;
  country: string;
  followersCount: number;
  message: string;
}
