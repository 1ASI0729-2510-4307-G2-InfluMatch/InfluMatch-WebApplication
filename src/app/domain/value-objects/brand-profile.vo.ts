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
}
