import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InfluencerProfileResponse, BrandProfileResponse } from '../dtos/profile-me.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileMeService {
  private readonly baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getInfluencerProfile(): Observable<InfluencerProfileResponse> {
    return this.http.get<InfluencerProfileResponse>(`${this.baseUrl}/profiles/influencer/me`, {
      headers: this.getHeaders()
    });
  }

  getBrandProfile(): Observable<BrandProfileResponse> {
    return this.http.get<BrandProfileResponse>(`${this.baseUrl}/profiles/brand/me`, {
      headers: this.getHeaders()
    });
  }
}
