// src/app/infrastructure/repositories/profile.repository.ts
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { ProfileApi } from '../api/profile.api';
import { InfluencerProfileVO, InfluencerProfileResponseVO } from '../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO, BrandProfileResponseVO } from '../../domain/value-objects/brand-profile.vo';
import { Profile } from '../../domain/entities/profile.entity';

@Injectable({ providedIn: 'root' })
export class ProfileRepositoryImpl extends ProfileRepository {
  constructor(private api: ProfileApi) {
    super();
  }

  listInfluencers(): Observable<InfluencerProfileVO[]> {
    return this.api.listInfluencers();
  }

  listBrands(): Observable<BrandProfileVO[]> {
    return this.api.listBrands();
  }

  createInfluencerProfile(data: InfluencerProfileVO): Observable<InfluencerProfileResponseVO> {
    return this.api.createInfluencerProfile(data);
  }

  createBrandProfile(data: BrandProfileVO): Observable<BrandProfileResponseVO> {
    return this.api.createBrandProfile(data);
  }

  // *** Implementaciones obligatorias ***

  loadForUser(userId: string): Observable<Profile> {
    // si tu ProfileApi tiene un método getByUser:
    // return this.api.loadForUser(userId);
    return throwError(() => new Error('loadForUser no implementado aún'));
  }

  saveInfluencer(data: InfluencerProfileVO): Observable<Profile> {
    // si el API expone algo como create/update:
    // return this.api.saveInfluencer(data);
    return throwError(() => new Error('saveInfluencer no implementado aún'));
  }

  saveBrand(data: BrandProfileVO): Observable<Profile> {
    // idem:
    // return this.api.saveBrand(data);
    return throwError(() => new Error('saveBrand no implementado aún'));
  }
}
