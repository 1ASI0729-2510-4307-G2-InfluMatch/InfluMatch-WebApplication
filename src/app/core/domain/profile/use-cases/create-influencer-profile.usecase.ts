import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileRepository } from '../repositories/profile.repository';
import { InfluencerProfileRequestDTO } from '../../../../features/profile-setup/application/dtos/influencer-profile-request.dto';
import { InfluencerProfileResponseDTO } from '../../../../features/profile-setup/application/dtos/influencer-profile-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CreateInfluencerProfileUseCase {
  private readonly repository = inject(ProfileRepository);

  execute(request: InfluencerProfileRequestDTO): Observable<InfluencerProfileResponseDTO> {
    return this.repository.createInfluencerProfile(request);
  }
}
