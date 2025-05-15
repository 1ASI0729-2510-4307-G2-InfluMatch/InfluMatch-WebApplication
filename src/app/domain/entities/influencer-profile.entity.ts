// domain/entities/influencer-profile.entity.ts
import { Profile } from './profile.entity';

export class InfluencerProfile extends Profile {
  constructor(
    userId: string,
    profileCompleted: boolean,
    public displayName: string,
    public bio: string,
    public location: string,
    public contactEmail: string,
    public niche: string,
    public followers: { instagram: number; tiktok: number; youtube: number },
    public ratePerPost: number,
    public engagementRate?: number,
    public mainAudience?: string,
    public languages?: string[],
    public socialLinks?: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    },
    public portfolioUrls?: string[]
  ) {
    super(userId, profileCompleted);
  }
}
