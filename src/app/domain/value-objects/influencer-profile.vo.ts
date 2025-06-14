export interface Link {
  title: string;
  url: string;
}

export interface SocialLink {
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'YOUTUBE' | 'TIKTOK';
  url: string;
}

export interface Attachment {
  title: string;
  description: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  data: string;
}

export class InfluencerProfileVO {
  constructor(
    public name: string,
    public niches: string[],
    public bio: string,
    public country: string,
    public photo: string,
    public profilePhoto: string,
    public followers: number,
    public socialLinks: SocialLink[],
    public location: string,
    public links: Link[],
    public attachments: Attachment[]
  ) {}
}
