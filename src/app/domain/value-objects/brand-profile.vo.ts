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

export class BrandProfileVO {
  constructor(
    public name: string,
    public sector: string,
    public country: string,
    public description: string,
    public logo: string,
    public profilePhoto: string,
    public websiteUrl: string,
    public location: string,
    public links: Link[],
    public attachments: Attachment[]
  ) {}

  toJSON() {
    return {
      name: this.name,
      sector: this.sector,
      country: this.country,
      description: this.description,
      logo: this.logo,
      profilePhoto: this.profilePhoto,
      websiteUrl: this.websiteUrl,
      location: this.location,
      links: this.links,
      attachments: this.attachments
    };
  }
}
