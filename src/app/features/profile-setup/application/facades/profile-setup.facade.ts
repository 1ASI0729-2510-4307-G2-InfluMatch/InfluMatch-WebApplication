import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateInfluencerProfileUseCase } from '@core/domain/profile/use-cases/create-influencer-profile.usecase';
import { CreateBrandProfileUseCase } from '@core/domain/profile/use-cases/create-brand-profile.usecase';
import { InfluencerProfileRequestDTO } from '../dtos/influencer-profile-request.dto';
import { BrandProfileRequestDTO } from '../dtos/brand-profile-request.dto';
import { InfluencerProfileResponseDTO } from '../dtos/influencer-profile-response.dto';
import { BrandProfileResponseDTO } from '../dtos/brand-profile-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileSetupFacade {
  private readonly createInfluencerUseCase = inject(CreateInfluencerProfileUseCase);
  private readonly createBrandUseCase = inject(CreateBrandProfileUseCase);

  createInfluencerProfile(request: InfluencerProfileRequestDTO): Observable<InfluencerProfileResponseDTO> {
    return this.createInfluencerUseCase.execute(request);
  }

  createBrandProfile(request: BrandProfileRequestDTO): Observable<BrandProfileResponseDTO> {
    return this.createBrandUseCase.execute(request);
  }
}
