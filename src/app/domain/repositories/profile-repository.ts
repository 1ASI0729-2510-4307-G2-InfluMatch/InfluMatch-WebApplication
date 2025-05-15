// domain/repositories/profile-repository.ts
import { Observable } from 'rxjs';
import { Profile } from '../entities/profile.entity';
import { InfluencerProfileVO } from '../value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../value-objects/brand-profile.vo';

export abstract class ProfileRepository {
  abstract loadForUser(userId: string): Observable<Profile>;
  abstract saveInfluencer(data: InfluencerProfileVO): Observable<Profile>;
  abstract saveBrand(data: BrandProfileVO): Observable<Profile>;

  abstract listInfluencers(): Observable<InfluencerProfileVO[]>;
  abstract listBrands(): Observable<BrandProfileVO[]>;
}
