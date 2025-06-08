import { Observable } from 'rxjs';
import { InfluencerProfileRequestDTO } from '../../../../features/profile-setup/application/dtos/influencer-profile-request.dto';
import { InfluencerProfileResponseDTO } from '../../../../features/profile-setup/application/dtos/influencer-profile-response.dto';
import { BrandProfileRequestDTO } from '../../../../features/profile-setup/application/dtos/brand-profile-request.dto';
import { BrandProfileResponseDTO } from '../../../../features/profile-setup/application/dtos/brand-profile-response.dto';

export abstract class ProfileRepository {
  abstract createInfluencerProfile(request: InfluencerProfileRequestDTO): Observable<InfluencerProfileResponseDTO>;
  abstract createBrandProfile(request: BrandProfileRequestDTO): Observable<BrandProfileResponseDTO>;
}
