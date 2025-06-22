import { Injectable } from '@angular/core';
import { Link, Attachment, SocialLink, BrandProfile, InfluencerProfile, ProfileListItem } from '../../domain/models/profile.model';
import { LinkDTO, AttachmentDTO, SocialLinkDTO, BrandProfileDTO, InfluencerProfileDTO, ProfileListItemDTO } from '../dtos/profile.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileAssembler {
  toProfileListItem(dto: ProfileListItemDTO): ProfileListItem {
    return {
      userId: dto.userId,
      tradeName: dto.tradeName,
      logoUrl: dto.logoUrl,
      country: dto.country,
      sector: dto.sector
    };
  }

  toBrandProfile(dto: BrandProfileDTO): BrandProfile {
    return {
      id: dto.id,
      name: dto.name,
      country: dto.country,
      logo: dto.logo,
      profilePhoto: dto.profilePhoto,
      location: dto.location,
      links: dto.links.map(link => this.toLink(link)),
      attachments: dto.attachments.map(attachment => this.toAttachment(attachment)),
      rating: dto.rating,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      sector: dto.sector,
      description: dto.description,
      websiteUrl: dto.websiteUrl
    };
  }

  toInfluencerProfile(dto: InfluencerProfileDTO): InfluencerProfile {
    return {
      id: dto.id,
      name: dto.name,
      country: dto.country,
      logo: dto.logo,
      profilePhoto: dto.profilePhoto,
      location: dto.location,
      links: dto.links.map(link => this.toLink(link)),
      attachments: dto.attachments.map(attachment => this.toAttachment(attachment)),
      rating: dto.rating,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      niches: dto.niches,
      bio: dto.bio,
      followers: dto.followers,
      socialLinks: dto.socialLinks.map(link => this.toSocialLink(link))
    };
  }

  private toLink(dto: LinkDTO): Link {
    return {
      id: dto.id,
      title: dto.title,
      url: dto.url,
      type: dto.type
    };
  }

  private toAttachment(dto: AttachmentDTO): Attachment {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      mediaType: dto.mediaType,
      data: dto.data,
      size: dto.size
    };
  }

  private toSocialLink(dto: SocialLinkDTO): SocialLink {
    return {
      platform: dto.platform,
      url: dto.url
    };
  }
} 