import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfileRepository } from '@core/domain/profile/repositories/profile.repository';
import { InfluencerProfileRequestDTO } from '../../features/profile-setup/application/dtos/influencer-profile-request.dto';
import { InfluencerProfileResponseDTO } from '../../features/profile-setup/application/dtos/influencer-profile-response.dto';
import { BrandProfileRequestDTO } from '../../features/profile-setup/application/dtos/brand-profile-request.dto';
import { BrandProfileResponseDTO } from '../../features/profile-setup/application/dtos/brand-profile-response.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileHttpRepository implements ProfileRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  createInfluencerProfile(request: InfluencerProfileRequestDTO): Observable<InfluencerProfileResponseDTO> {
    return this.http.post<InfluencerProfileResponseDTO>(`${this.baseUrl}/influencers`, request);
  }

  createBrandProfile(request: BrandProfileRequestDTO): Observable<BrandProfileResponseDTO> {
    return this.http.post<BrandProfileResponseDTO>(`${this.baseUrl}/brands`, request);
  }
}
