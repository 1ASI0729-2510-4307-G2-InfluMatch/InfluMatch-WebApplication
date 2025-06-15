import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { UserProfileRepository } from '../../../../domain/repositories/user-profile-repository';
import { UserProfileRepositoryImpl } from '../../../../infrastructure/repositories/user-profile.repository';
import { UserProfileDetailVO } from '../../../../domain/value-objects/user-profile-detail.vo';
import { AuthService } from '../../../../infrastructure/services/auth.service';

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
  providers: [
    {
      provide: UserProfileRepository,
      useClass: UserProfileRepositoryImpl
    }
  ]
})
export class ProfileComponent implements OnInit {
  user: UserProfileDetailVO | null = null;
  loading = true;
  error = false;

  constructor(
    private userProfileRepository: UserProfileRepository,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = false;
    
    this.userProfileRepository.getUserProfile().subscribe({
      next: (userData: UserProfileDetailVO) => {
        this.user = userData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.error = true;
        this.loading = false;
      },
    });
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

  // Método para obtener las redes sociales como array
  getSocialLinks(): { platform: string; url: string; icon: string }[] {
    if (!this.user?.socialLinks) return [];

    const result = [];
    const icons: { [key: string]: string } = {
      instagram: 'instagram',
      facebook: 'facebook',
      twitter: 'twitter',
      tiktok: 'tiktok',
      youtube: 'youtube',
    };

    for (const social of this.user.socialLinks) {
      if (social.url) {
        result.push({
          platform: social.platform,
          url: social.url,
          icon: icons[social.platform.toLowerCase()] || 'link',
        });
      }
    }

    return result;
  }

  // Método para verificar si es influencer
  isInfluencer(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.user_type === 'influencer';
  }

  // Método para verificar si es marca
  isBrand(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.user_type === 'marca';
  }

  // Método para obtener la imagen de perfil
  getProfileImage(): string {
    if (!this.user) return '';
    
    if (this.user.profilePhoto) {
      return `data:image/jpeg;base64,${this.user.profilePhoto}`;
    }
    
    if (this.user.photo) {
      return `data:image/jpeg;base64,${this.user.photo}`;
    }
    
    if (this.user.logo) {
      return `data:image/jpeg;base64,${this.user.logo}`;
    }
    
    return '';
  }

  // Método para verificar si un campo tiene valor
  hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  // Método para obtener el icono del tipo de adjunto
  getAttachmentIcon(mediaType: string): string {
    switch (mediaType) {
      case 'PHOTO':
        return 'image';
      case 'VIDEO':
        return 'video_library';
      case 'DOCUMENT':
        return 'description';
      default:
        return 'attachment';
    }
  }

  // Método para formatear fechas
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
