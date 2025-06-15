import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileMeService } from '../../../../infrastructure/services/profile-me.service';

import {
  InfluencerProfileResponse,
  BrandProfileResponse,
} from '../../../../infrastructure/dtos/profile-me.dto';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error = false;

  constructor(
    private authService: AuthService,
    private profileMeService: ProfileMeService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual del AuthService
    const currentUser = this.authService.currentUser;

    if (currentUser) {

      const request$: Observable<InfluencerProfileResponse | BrandProfileResponse> =
        currentUser.profileType === 'INFLUENCER'
          ? this.profileMeService.getInfluencerProfile()
          : this.profileMeService.getBrandProfile();

      request$.subscribe({
        next: (userData: InfluencerProfileResponse | BrandProfileResponse) => {

      const request$ = currentUser.profileType === 'INFLUENCER'
        ? this.profileMeService.getInfluencerProfile()
        : this.profileMeService.getBrandProfile();

      request$.subscribe({
        next: (userData) => {

          this.user = userData;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  // Método para formatear los seguidores en K o M
  formatFollowers(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  // Método para calcular el total de seguidores
  getTotalFollowers(): number {
    if (!this.user?.followers) return 0;

    if (typeof this.user.followers === 'number') {
      return this.user.followers;
    }

    let total = 0;
    if (this.user.followers.instagram) total += this.user.followers.instagram;
    if (this.user.followers.tiktok) total += this.user.followers.tiktok;
    if (this.user.followers.youtube) total += this.user.followers.youtube;

    return total;
  }

  // Método para obtener las redes sociales como array
  getSocialLinks(): { platform: string; url: string; icon: string }[] {
    const icons: { [key: string]: string } = {
      instagram: 'instagram',
      facebook: 'facebook',
      twitter: 'twitter',
      tiktok: 'tiktok',
      youtube: 'youtube',
    };

    if (Array.isArray(this.user?.socialLinks)) {
      return this.user.socialLinks.map((link: any) => ({
        platform: link.platform,
        url: link.url,
        icon: icons[link.platform.toLowerCase()] || 'link',
      }));
    }

    if (!this.user?.social_links) return [];

    const result = [];
    for (const [platform, url] of Object.entries(this.user.social_links)) {
      if (url) {
        result.push({
          platform,
          url: url as string,
          icon: icons[platform] || 'link',
        });
      }
    }

    return result;
  }

  // Método para verificar si es influencer
  isInfluencer(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.profileType === 'INFLUENCER';
  }

  // Método para verificar si es marca
  isBrand(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.profileType === 'BRAND';
  }
}
