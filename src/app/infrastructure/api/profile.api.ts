import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfluencerProfileVO, InfluencerProfileResponseVO } from '../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO, BrandProfileResponseVO } from '../../domain/value-objects/brand-profile.vo';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private base = environment.apiBase;
  
  constructor(private http: HttpClient) {}

  listInfluencers(): Observable<InfluencerProfileVO[]> {
    return this.http.get<InfluencerProfileVO[]>(
      `${this.base}/users-register?user_type=influencer`
    );
  }

  listBrands(): Observable<BrandProfileVO[]> {
    return this.http.get<BrandProfileVO[]>(`${this.base}/users-register?user_type=marca`);
  }

  createInfluencerProfile(data: InfluencerProfileVO): Observable<InfluencerProfileResponseVO> {
    return this.http.post<InfluencerProfileResponseVO>(`${this.base}/influencers`, data);
  }

  createBrandProfile(data: BrandProfileVO): Observable<BrandProfileResponseVO> {
    return this.http.post<BrandProfileResponseVO>(`${this.base}/brands`, data);
  }
}
