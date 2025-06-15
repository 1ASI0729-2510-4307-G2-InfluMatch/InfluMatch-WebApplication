import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../../../infrastructure/services/profile.service';
import { BrandProfile, InfluencerProfile } from '../../../domain/models/profile.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule
  ]
})
export class ProfileDetailsComponent implements OnInit {
  profile$!: Observable<BrandProfile | InfluencerProfile | null>;
  userType!: 'BRAND' | 'INFLUENCER';
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get the current user type from local storage
    const storedType = localStorage.getItem('profileType');
    if (!storedType || (storedType !== 'BRAND' && storedType !== 'INFLUENCER')) {
      this.error = 'Invalid user type';
      this.navigateToDashboard();
      return;
    }
    this.userType = storedType;
    
    // Initialize the profile$ observable
    this.profile$ = this.route.params.pipe(
      switchMap(params => {
        const userId = +params['id'];
        if (!userId) {
          this.error = 'Invalid profile ID';
          return of(null);
        }

        return this.profileService.getProfileById(userId).pipe(
          catchError(err => {
            console.error('Error loading profile:', err);
            this.error = err.message || 'Failed to load profile details';
            return of(null);
          })
        );
      })
    );

    this.profile$.subscribe({
      next: (profile) => {
        this.loading = false;
        if (!profile) {
          this.error = 'Profile not found';
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile details';
        this.loading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  navigateToDashboard(): void {
    Promise.resolve().then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  isBrandProfile(profile: any): profile is BrandProfile {
    return profile && 'sector' in profile;
  }

  isInfluencerProfile(profile: any): profile is InfluencerProfile {
    return profile && 'niches' in profile;
  }

  hasValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  // Métodos para manejar imágenes base64
  getImageUrl(base64Data: string): SafeUrl | null {
    if (!this.hasValue(base64Data)) return null;
    try {
      const url = `data:image/jpeg;base64,${base64Data}`;
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  }

  getVideoUrl(base64Data: string): SafeUrl | null {
    if (!this.hasValue(base64Data)) return null;
    try {
      const url = `data:video/mp4;base64,${base64Data}`;
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      console.error('Error creating video URL:', error);
      return null;
    }
  }

  getDocumentUrl(base64Data: string): SafeUrl | null {
    if (!this.hasValue(base64Data)) return null;
    try {
      const url = `data:application/pdf;base64,${base64Data}`;
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      console.error('Error creating document URL:', error);
      return null;
    }
  }

  // Métodos para formatear datos
  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatFollowers(followers: number): string {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  }

  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      'INSTAGRAM': 'camera_alt',
      'YOUTUBE': 'play_circle',
      'TIKTOK': 'music_note',
      'FACEBOOK': 'facebook',
      'TWITTER': 'twitter'
    };
    return icons[platform] || 'link';
  }

  getAttachmentIcon(mediaType: string): string {
    const icons: { [key: string]: string } = {
      'PHOTO': 'image',
      'VIDEO': 'videocam',
      'DOCUMENT': 'description',
      'AUDIO': 'audiotrack'
    };
    return icons[mediaType] || 'insert_drive_file';
  }

  downloadAttachment(attachment: any): void {
    if (!attachment.data) return;
    
    try {
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${attachment.data}`;
      link.download = attachment.title || 'attachment';
      link.click();
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  // Hacer Math disponible en el template
  get Math() {
    return Math;
  }
} 