import { Brand } from '@core/domain/dashboard/entities/brand.entity';
import { BrandResponseDTO } from '../dtos/brand-response.dto';

export class BrandAssembler {
  static toEntity(dto: BrandResponseDTO): Brand {
    return new Brand(
      dto.id,
      dto.userId,
      dto.companyName,
      dto.description,
      dto.industry,
      dto.websiteUrl,
      dto.logoUrl
    );
  }

  static toEntityList(dtos: BrandResponseDTO[]): Brand[] {
    return dtos.map(dto => this.toEntity(dto));
  }
} 