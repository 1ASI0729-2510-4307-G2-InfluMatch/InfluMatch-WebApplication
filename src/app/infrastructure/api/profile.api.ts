import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfluencerProfileVO } from '../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../domain/value-objects/brand-profile.vo';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly resource = 'profiles';
  private readonly url = `${environment.apiBase}/${this.resource}`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createBrandProfile(profile: BrandProfileVO): Observable<any> {
    return this.http.post(`${this.url}/brand`, profile.toJSON(), {
      headers: this.getHeaders()
    });
  }

  createInfluencerProfile(profile: InfluencerProfileVO): Observable<any> {
    return this.http.post(`${this.url}/influencer`, profile.toJSON(), {
      headers: this.getHeaders()
    });
  }

  updateBrandProfile(profile: BrandProfileVO): Observable<any> {
    return this.http.put(`${this.url}/brand`, profile.toJSON(), {
      headers: this.getHeaders()
    });
  }

  updateInfluencerProfile(profile: InfluencerProfileVO): Observable<any> {
    return this.http.put(`${this.url}/influencer`, profile.toJSON(), {
      headers: this.getHeaders()
    });
  }

  getBrandProfile(): Observable<any> {
    return this.http.get(`${this.url}/brand`, {
      headers: this.getHeaders()
    });
  }

  getInfluencerProfile(): Observable<any> {
    return this.http.get(`${this.url}/influencer`, {
      headers: this.getHeaders()
    });
  }
}
