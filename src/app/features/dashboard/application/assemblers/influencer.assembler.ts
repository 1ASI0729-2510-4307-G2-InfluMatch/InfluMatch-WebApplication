import { Influencer } from '@core/domain/dashboard/entities/influencer.entity';
import { InfluencerResponseDTO } from '../dtos/influencer-response.dto';

export class InfluencerAssembler {
  static toEntity(dto: InfluencerResponseDTO): Influencer {
    return new Influencer(
      dto.id,
      dto.userId,
      dto.displayName,
      dto.bio,
      dto.category,
      dto.country,
      dto.followersCount
    );
  }

  static toEntityList(dtos: InfluencerResponseDTO[]): Influencer[] {
    return dtos.map(dto => this.toEntity(dto));
  }
} 