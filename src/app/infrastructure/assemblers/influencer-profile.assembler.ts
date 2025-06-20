import { Injectable } from '@angular/core';
import { InfluencerProfileVO, InfluencerProfileResponseVO, SocialLink, MediaAsset } from '../../domain/value-objects/influencer-profile.vo';

@Injectable({ providedIn: 'root' })
export class InfluencerProfileAssembler {
  toVO(dto: any): InfluencerProfileVO {
    return {
      displayName: dto.displayName,
      bio: dto.bio,
      category: dto.category,
      country: dto.country,
      followersCount: dto.followersCount,
      socialLinks: this.transformSocialLinks(dto.socialLinks),
      mediaAssets: this.transformMediaAssets(dto.mediaAssets)
    };
  }

  toResponseVO(dto: any): InfluencerProfileResponseVO {
    return {
      id: dto.id,
      userId: dto.userId,
      displayName: dto.displayName,
      bio: dto.bio,
      category: dto.category,
      country: dto.country,
      followersCount: dto.followersCount,
      message: dto.message
    };
  }

  private transformSocialLinks(links?: any[]): SocialLink[] | undefined {
    if (!links) return undefined;
    return links.map(link => ({
      platform: link.platform,
      url: link.url
    }));
  }

  private transformMediaAssets(assets?: any[]): MediaAsset[] | undefined {
    if (!assets) return undefined;
    return assets.map(asset => ({
      url: asset.url,
      mediaType: asset.mediaType,
      title: asset.title,
      description: asset.description,
      sizeBytes: asset.sizeBytes,
      metadata: asset.metadata
    }));
  }

  // Validaciones de dominio
  validateProfile(profile: InfluencerProfileVO): string[] {
    const errors: string[] = [];

    if (profile.displayName && (profile.displayName.length < 3 || profile.displayName.length > 50)) {
      errors.push('El nombre debe tener entre 3 y 50 caracteres');
    }

    if (profile.bio && profile.bio.length > 255) {
      errors.push('La biografía no puede exceder los 255 caracteres');
    }

    if (profile.category && profile.category.length > 50) {
      errors.push('La categoría no puede exceder los 50 caracteres');
    }

    if (profile.country && profile.country.length > 50) {
      errors.push('El país no puede exceder los 50 caracteres');
    }

    if (profile.followersCount && profile.followersCount < 0) {
      errors.push('El número de seguidores debe ser positivo');
    }

    if (profile.socialLinks) {
      profile.socialLinks.forEach((link, index) => {
        if (!['IG', 'YT', 'TT', 'FB', 'TW', 'LN', 'OTHER'].includes(link.platform)) {
          errors.push(`Plataforma inválida en el enlace social ${index + 1}`);
        }
        if (!link.url) {
          errors.push(`URL requerida en el enlace social ${index + 1}`);
        }
      });
    }

    if (profile.mediaAssets) {
      profile.mediaAssets.forEach((asset, index) => {
        if (!['IMAGE', 'VIDEO', 'DOC'].includes(asset.mediaType)) {
          errors.push(`Tipo de medio inválido en el asset ${index + 1}`);
        }
        if (!asset.url) {
          errors.push(`URL requerida en el asset ${index + 1}`);
        }
      });
    }

    return errors;
  }
} 