export class DashboardProfileVO {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly bio: string,
    public readonly photoUrl: string | null,
    public readonly country: string,
    public readonly mainNiche: string,
    public readonly followersCount: number
  ) {}

  static create(props: {
    userId: number;
    name: string;
    bio: string;
    photoUrl: string | null;
    country: string;
    mainNiche: string;
    followersCount: number;
  }): DashboardProfileVO {
    return new DashboardProfileVO(
      props.userId,
      props.name,
      props.bio,
      props.photoUrl,
      props.country,
      props.mainNiche,
      props.followersCount
    );
  }
} 