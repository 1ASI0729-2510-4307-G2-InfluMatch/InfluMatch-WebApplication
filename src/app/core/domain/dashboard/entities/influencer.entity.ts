export class Influencer {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly displayName: string,
    public readonly bio: string,
    public readonly category: string,
    public readonly country: string,
    public readonly followersCount: number
  ) {}
} 