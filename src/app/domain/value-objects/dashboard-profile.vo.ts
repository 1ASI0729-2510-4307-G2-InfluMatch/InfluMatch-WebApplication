export class DashboardProfileVO {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly imageUrl: string | null,
    public readonly country: string,
    public readonly category: string,
    public readonly type: 'influencer' | 'brand',
    public readonly bio?: string,
    public readonly followersCount?: number,
  ) {}

  static createInfluencer(props: {
    userId: number;
    name: string;
    photoUrl: string | null;
    country: string;
    mainNiche: string;
    bio: string;
    followersCount: number;
  }): DashboardProfileVO {
    return new DashboardProfileVO(
      props.userId,
      props.name,
      props.photoUrl,
      props.country,
      props.mainNiche,
      'influencer',
      props.bio,
      props.followersCount
    );
  }

  static createBrand(props: {
    userId: number;
    tradeName: string;
    logoUrl: string | null;
    country: string;
    sector: string;
  }): DashboardProfileVO {
    return new DashboardProfileVO(
      props.userId,
      props.tradeName,
      props.logoUrl,
      props.country,
      props.sector,
      'brand'
    );
  }
} 