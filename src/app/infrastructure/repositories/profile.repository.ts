// src/app/infrastructure/repositories/profile.repository.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { ProfileApi } from '../api/profile.api';
import { InfluencerProfileVO } from '../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../domain/value-objects/brand-profile.vo';

@Injectable({ providedIn: 'root' })
export class ProfileRepositoryImpl extends ProfileRepository {
  constructor(private api: ProfileApi) {
    super();
  }

  createBrandProfile(profile: BrandProfileVO): Observable<any> {
    return this.api.createBrandProfile(profile);
  }

  createInfluencerProfile(profile: InfluencerProfileVO): Observable<any> {
    return this.api.createInfluencerProfile(profile);
  }

  updateBrandProfile(profile: BrandProfileVO): Observable<any> {
    return this.api.updateBrandProfile(profile);
  }

  updateInfluencerProfile(profile: InfluencerProfileVO): Observable<any> {
    return this.api.updateInfluencerProfile(profile);
  }

  getBrandProfile(): Observable<any> {
    return this.api.getBrandProfile();
  }

  getInfluencerProfile(): Observable<any> {
    return this.api.getInfluencerProfile();
  }
}
