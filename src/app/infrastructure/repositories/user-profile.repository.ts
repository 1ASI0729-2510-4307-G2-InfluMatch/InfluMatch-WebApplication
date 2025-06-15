import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserProfileRepository } from '../../domain/repositories/user-profile-repository';
import { UserProfileDetailVO, ProfileLink, ProfileAttachment, ProfileSocialLink } from '../../domain/value-objects/user-profile-detail.vo';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileRepositoryImpl implements UserProfileRepository {
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUserProfile(): Observable<UserProfileDetailVO> {
    const currentUser = this.authService.currentUser;
    const userType = currentUser?.user_type;
    const endpoint = userType === 'marca' 
      ? `${environment.apiBase}/profiles/brand/me`
      : `${environment.apiBase}/profiles/influencer/me`;

    return this.http.get<any>(endpoint, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.mapToUserProfileDetailVO(response))
    );
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    if (!token) {
      throw new Error('No access token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private mapToUserProfileDetailVO(data: any): UserProfileDetailVO {
    const links: ProfileLink[] = data.links || [];
    const attachments: ProfileAttachment[] = data.attachments || [];
    const socialLinks: ProfileSocialLink[] = data.socialLinks || [];

    return new UserProfileDetailVO(
      data.id,
      data.name,
      data.country,
      links,
      attachments,
      data.createdAt,
      data.updatedAt,
      data.sector || null,
      data.description || null,
      data.bio || null,
      data.niches || null,
      data.logo || null,
      data.profilePhoto || null,
      data.photo || null,
      data.websiteUrl || null,
      data.location || null,
      data.followers || null,
      socialLinks
    );
  }
} 