import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DashboardProfileVO } from '../../../../domain/value-objects/dashboard-profile.vo';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, TranslateModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input() profile!: DashboardProfileVO;
  @Input() type: 'influencer' | 'brand' = 'influencer';

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  viewDetails(): void {
    this.router.navigate(['/dashboard/profile', this.profile.userId]);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getImageSrc(imageUrl: string | null): string | SafeUrl {
    if (!imageUrl) {
      return this.profile.type === 'brand' 
        ? '/assets/default-brand.png' 
        : '/assets/default-avatar.png';
    }

    // Si la imagen es base64
    if (imageUrl.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    // Si es una URL normal
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // Si es una ruta relativa
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }
}
