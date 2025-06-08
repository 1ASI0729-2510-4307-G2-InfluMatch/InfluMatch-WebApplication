import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileRepository } from '../repositories/profile.repository';
import { BrandProfileRequestDTO } from '../../../../features/profile-setup/application/dtos/brand-profile-request.dto';
import { BrandProfileResponseDTO } from '../../../../features/profile-setup/application/dtos/brand-profile-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CreateBrandProfileUseCase {
  private readonly repository = inject(ProfileRepository);

  execute(request: BrandProfileRequestDTO): Observable<BrandProfileResponseDTO> {
    return this.repository.createBrandProfile(request);
  }
}
