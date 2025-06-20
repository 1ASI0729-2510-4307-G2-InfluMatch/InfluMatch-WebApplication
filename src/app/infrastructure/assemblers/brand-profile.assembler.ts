import { Injectable } from '@angular/core';
import { BrandProfileVO, BrandProfileResponseVO } from '../../domain/value-objects/brand-profile.vo';

@Injectable({ providedIn: 'root' })
export class BrandProfileAssembler {
  toVO(dto: any): BrandProfileVO {
    return {
      companyName: dto.companyName,
      description: dto.description,
      industry: dto.industry,
      websiteUrl: dto.websiteUrl,
      logoUrl: dto.logoUrl
    };
  }

  toResponseVO(dto: any): BrandProfileResponseVO {
    return {
      id: dto.id,
      userId: dto.userId,
      companyName: dto.companyName,
      description: dto.description,
      industry: dto.industry,
      websiteUrl: dto.websiteUrl,
      logoUrl: dto.logoUrl,
      message: dto.message
    };
  }

  // Validaciones de dominio
  validateProfile(profile: BrandProfileVO): string[] {
    const errors: string[] = [];

    if (!profile.companyName || profile.companyName.length < 2 || profile.companyName.length > 50) {
      errors.push('El nombre de la empresa debe tener entre 2 y 50 caracteres');
    }

    if (profile.description && profile.description.length > 255) {
      errors.push('La descripción no puede exceder los 255 caracteres');
    }

    if (profile.industry && profile.industry.length > 50) {
      errors.push('El sector no puede exceder los 50 caracteres');
    }

    if (profile.websiteUrl) {
      try {
        new URL(profile.websiteUrl);
      } catch {
        errors.push('La URL del sitio web no es válida');
      }
    }

    if (profile.logoUrl) {
      try {
        new URL(profile.logoUrl);
      } catch {
        errors.push('La URL del logo no es válida');
      }
    }

    return errors;
  }
} 