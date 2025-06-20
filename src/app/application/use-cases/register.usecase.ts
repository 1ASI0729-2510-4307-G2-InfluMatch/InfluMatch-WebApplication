import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { Router } from '@angular/router';
import { BrandProfileVO } from '../../domain/value-objects/brand-profile.vo';
import { InfluencerProfileVO } from '../../domain/value-objects/influencer-profile.vo';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(
    private authRepo: AuthRepository,
    private profileRepo: ProfileRepository,
    private router: Router,
    private http: HttpClient
  ) {}

  execute(email: string, password: string, role: string): Observable<any> {
    return this.authRepo.register(email, password, role).pipe(
      tap(response => {
        if (!response.profileCompleted) {
          // Store tokens and redirect to onboarding
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('profileType', response.profileType);
          
          this.router.navigate(['/onboarding']);
        } else {
          // Store complete profile data
          localStorage.setItem('userProfile', JSON.stringify(response));
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  createProfile(profile: BrandProfileVO | InfluencerProfileVO): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    if (profile instanceof BrandProfileVO) {
      const brandProfile = new BrandProfileVO(
        profile.name,
        profile.sector,
        profile.country,
        profile.description,
        profile.logo,
        profile.profilePhoto,
        profile.websiteUrl,
        profile.location,
        profile.links,
        profile.attachments
      );

      return this.http.post('http://localhost:8080/api/profiles/brand', brandProfile, { headers });
    } else {
      const influencerProfile = new InfluencerProfileVO(
        profile.name,
        profile.niches,
        profile.bio,
        profile.country,
        profile.photo,
        profile.profilePhoto,
        profile.followers,
        profile.socialLinks,
        profile.location,
        profile.links,
        profile.attachments
      );

      return this.http.post('http://localhost:8080/api/profiles/influencer', influencerProfile, { headers });
    }
  }
}