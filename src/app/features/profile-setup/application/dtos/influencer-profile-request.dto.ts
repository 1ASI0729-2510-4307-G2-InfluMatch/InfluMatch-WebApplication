interface SocialLink {
  platform: string;  // IG, YT, TT, FB, TW, LN, OTHER
  url: string;
}

interface MediaAsset {
  url: string;
  mediaType: string;  // IMAGE, VIDEO, DOC
  title?: string;
  description?: string;
  sizeBytes?: number;
  metadata?: Record<string, unknown>;
}

export interface InfluencerProfileRequestDTO {
    displayName: string;
    bio: string;
    category: string;
    country: string;
    followersCount: number;
    socialLinks?: SocialLink[];
    mediaAssets?: MediaAsset[];
  }
  