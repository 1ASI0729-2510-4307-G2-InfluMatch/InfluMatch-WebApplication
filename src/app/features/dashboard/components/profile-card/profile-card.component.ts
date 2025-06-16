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

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  viewDetails(): void {
    this.router.navigate(['/dashboard/profile', this.profile.userId]);
  }

  contactUser(): void {
    this.router.navigate(['/dashboard/new-collaboration'], {
      queryParams: {
        counterpartId: this.profile.userId,
        counterpartName: this.profile.name
      }
    });
  }

  sendRequest(): void {
    // TODO: Implementar lógica para enviar solicitud de colaboración
    console.log('Enviar solicitud a:', this.profile.name);
    // Por ahora, redirigir a la página de nueva colaboración
    this.router.navigate(['/dashboard/new-collaboration'], {
      queryParams: {
        counterpartId: this.profile.userId,
        counterpartName: this.profile.name
      }
    });
  }

  sendMessage(): void {
    // Navegar al chat con este usuario
    this.router.navigate(['/dashboard/chats', this.profile.userId]);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getImageSrc(imageUrl: string | null): SafeUrl {
    if (!imageUrl) {
      return this.profile.type === 'brand' 
        ? '/assets/images/logo-dark.png' 
        : '/assets/images/default-avatar.svg';
    }

    // Si la imagen ya es una URL de datos base64 completa
    if (imageUrl.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    // Si es solo el string base64, agregamos el prefijo necesario
    if (this.isBase64(imageUrl)) {
      const base64Image = `data:image/jpeg;base64,${imageUrl}`;
      return this.sanitizer.bypassSecurityTrustUrl(base64Image);
    }

    // Si es una URL normal
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // Si es una ruta relativa
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }

  private isBase64(str: string): boolean {
    try {
      // Intenta verificar si el string es base64 válido
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }
}
