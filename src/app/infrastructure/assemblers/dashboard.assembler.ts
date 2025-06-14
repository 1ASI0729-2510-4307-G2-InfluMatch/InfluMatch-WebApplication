import { DashboardProfileVO } from '../../domain/value-objects/dashboard-profile.vo';

export class DashboardAssembler {
  toValueObject(data: any): DashboardProfileVO {
    return DashboardProfileVO.create({
      userId: data.userId,
      name: data.name,
      bio: data.bio || '',
      photoUrl: data.photoUrl || null,
      country: data.country || '',
      mainNiche: data.mainNiche || '',
      followersCount: data.followersCount || 0
    });
  }
} 