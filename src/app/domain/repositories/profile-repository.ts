// domain/repositories/profile-repository.ts
import { Observable } from 'rxjs';
import { BrandProfileVO } from '../value-objects/brand-profile.vo';
import { InfluencerProfileVO } from '../value-objects/influencer-profile.vo';

export abstract class ProfileRepository {
  abstract createBrandProfile(profile: BrandProfileVO): Observable<any>;
  abstract createInfluencerProfile(profile: InfluencerProfileVO): Observable<any>;
  abstract updateBrandProfile(profile: BrandProfileVO): Observable<any>;
  abstract updateInfluencerProfile(profile: InfluencerProfileVO): Observable<any>;
  abstract getBrandProfile(): Observable<any>;
  abstract getInfluencerProfile(): Observable<any>;
}