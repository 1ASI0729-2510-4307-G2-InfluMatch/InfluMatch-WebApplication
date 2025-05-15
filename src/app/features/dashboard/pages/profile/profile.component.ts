import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

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

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Obtener el usuario actual del AuthService
    const currentUser = this.authService.currentUser;

    if (currentUser) {
      // Consultar la API para obtener los datos completos del perfil
      this.http
        .get(`${environment.apiBase}/users-register/${currentUser.id}`)
        .subscribe({
          next: (userData: any) => {
            this.user = userData;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar el perfil:', err);
            this.error = true;
            this.loading = false;

            // Si falla la consulta, usar los datos que ya tenemos del login
            this.user = currentUser;
          },
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

    let total = 0;
    if (this.user.followers.instagram) total += this.user.followers.instagram;
    if (this.user.followers.tiktok) total += this.user.followers.tiktok;
    if (this.user.followers.youtube) total += this.user.followers.youtube;

    return total;
  }

  // Método para obtener las redes sociales como array
  getSocialLinks(): { platform: string; url: string; icon: string }[] {
    if (!this.user?.social_links) return [];

    const result = [];
    const icons: { [key: string]: string } = {
      instagram: 'instagram',
      facebook: 'facebook',
      twitter: 'twitter',
      tiktok: 'tiktok',
      youtube: 'youtube',
    };

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
    return this.user?.user_type === 'influencer';
  }

  // Método para verificar si es marca
  isBrand(): boolean {
    return this.user?.user_type === 'marca';
  }
}
