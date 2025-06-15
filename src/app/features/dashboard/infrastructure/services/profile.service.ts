import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BrandProfileDTO, InfluencerProfileDTO, ProfileListItemDTO } from '../dtos/profile.dto';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { BrandProfile, InfluencerProfile, ProfileListItem } from '../../domain/models/profile.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = environment.apiBase;

  constructor(
    private http: HttpClient,
    private assembler: ProfileAssembler
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProfiles(): Observable<ProfileListItem[]> {
    const headers = this.getHeaders();
    return this.http.get<ProfileListItemDTO[]>(`${this.API_URL}/dashboard/profiles`, { headers })
      .pipe(
        map(dtos => dtos.map(dto => this.assembler.toProfileListItem(dto)))
      );
  }

  getBrandProfile(id: number): Observable<BrandProfile> {
    const headers = this.getHeaders();
    return this.http.get<BrandProfileDTO>(`${this.API_URL}/dashboard/brands/${id}`, { headers })
      .pipe(
        map(dto => this.assembler.toBrandProfile(dto))
      );
  }

  getInfluencerProfile(id: number): Observable<InfluencerProfile> {
    const headers = this.getHeaders();
    return this.http.get<InfluencerProfileDTO>(`${this.API_URL}/dashboard/influencers/${id}`, { headers })
      .pipe(
        map(dto => this.assembler.toInfluencerProfile(dto))
      );
  }

  getProfileById(id: number): Observable<BrandProfile | InfluencerProfile> {
    const userType = localStorage.getItem('profileType');
    if (userType === 'BRAND') {
      return this.getInfluencerProfile(id);
    } else if (userType === 'INFLUENCER') {
      return this.getBrandProfile(id);
    } else {
      throw new Error('Invalid user type');
    }
  }
} 