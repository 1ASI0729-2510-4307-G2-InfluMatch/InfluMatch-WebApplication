import { DashboardProfileVO } from '../../domain/value-objects/dashboard-profile.vo';

export class DashboardAssembler {
  toValueObject(data: any, type: 'influencer' | 'brand'): DashboardProfileVO {
    if (type === 'influencer') {
      return DashboardProfileVO.createInfluencer({
        userId: data.userId,
        name: data.name,
        photoUrl: data.photoUrl || null,
        country: data.country || '',
        mainNiche: data.mainNiche || '',
        bio: data.bio || '',
        followersCount: data.followersCount || 0
      });
    } else {
      return DashboardProfileVO.createBrand({
        userId: data.userId,
        tradeName: data.tradeName,
        logoUrl: data.logoUrl || null,
        country: data.country || '',
        sector: data.sector || ''
      });
    }
  }
} 