export class Brand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly companyName: string,
    public readonly description: string,
    public readonly industry: string,
    public readonly websiteUrl: string,
    public readonly logoUrl: string
  ) {}
} 