export interface ProfileLink {
  title: string;
  url: string;
}

export interface ProfileAttachment {
  title: string;
  description: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  data: string;
}

export interface ProfileSocialLink {
  platform: string;
  url: string;
}

export class UserProfileDetailVO {
  constructor(
    public id: number,
    public name: string,
    public country: string,
    public links: ProfileLink[],
    public attachments: ProfileAttachment[],
    public createdAt: string,
    public updatedAt: string,
    public sector?: string | null,
    public description?: string | null,
    public bio?: string | null,
    public niches?: string[] | null,
    public logo?: string | null,
    public profilePhoto?: string | null,
    public photo?: string | null,
    public websiteUrl?: string | null,
    public location?: string | null,
    public followers?: number | null,
    public socialLinks?: ProfileSocialLink[] | null
  ) {}

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      sector: this.sector,
      country: this.country,
      description: this.description,
      bio: this.bio,
      niches: this.niches,
      logo: this.logo,
      profilePhoto: this.profilePhoto,
      photo: this.photo,
      websiteUrl: this.websiteUrl,
      location: this.location,
      followers: this.followers,
      socialLinks: this.socialLinks,
      links: this.links,
      attachments: this.attachments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 