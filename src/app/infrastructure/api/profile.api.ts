import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfluencerProfileVO } from '../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../domain/value-objects/brand-profile.vo';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private base = `${environment.apiBase}/users-register`;
  constructor(private http: HttpClient) {}

  listInfluencers(): Observable<InfluencerProfileVO[]> {
    return this.http.get<InfluencerProfileVO[]>(
      `${this.base}?user_type=influencer`
    );
  }

  listBrands(): Observable<BrandProfileVO[]> {
    return this.http.get<BrandProfileVO[]>(`${this.base}?user_type=marca`);
  }
}
