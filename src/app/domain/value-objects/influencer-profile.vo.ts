export interface Link {
  title: string;
  url: string;
}

export interface SocialLink {
  platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK' | 'TWITTER';
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

  toJSON() {
    return {
      name: this.name,
      niches: this.niches,
      bio: this.bio,
      country: this.country,
      photo: this.photo,
      profilePhoto: this.profilePhoto,
      followers: this.followers,
      socialLinks: this.socialLinks,
      location: this.location,
      links: this.links,
      attachments: this.attachments
    };
  }
}