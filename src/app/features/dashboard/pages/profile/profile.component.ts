import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
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
    private authService: AuthService,
    private sanitizer: DomSanitizer
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
  getProfileImage(): SafeUrl | string {
    if (!this.user) return '';
    
    if (this.user.profilePhoto) {
      return this.createImageUrl(this.user.profilePhoto);
    }
    
    if (this.user.photo) {
      return this.createImageUrl(this.user.photo);
    }
    
    if (this.user.logo) {
      return this.createImageUrl(this.user.logo);
    }
    
    return '';
  }

  // Método para crear URL segura de imagen base64
  createImageUrl(base64Data: string): SafeUrl {
    if (!base64Data) return '';
    
    // Si ya tiene el prefijo data:image, usarlo directamente
    if (base64Data.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(base64Data);
    }
    
    // Si es solo base64, agregar el prefijo
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  // Método para crear URL segura de video base64
  createVideoUrl(base64Data: string): SafeUrl {
    if (!base64Data) return '';
    
    // Si ya tiene el prefijo data:video, usarlo directamente
    if (base64Data.startsWith('data:video')) {
      return this.sanitizer.bypassSecurityTrustUrl(base64Data);
    }
    
    // Si es solo base64, agregar el prefijo
    const videoUrl = `data:video/mp4;base64,${base64Data}`;
    return this.sanitizer.bypassSecurityTrustUrl(videoUrl);
  }

  // Método para crear URL segura de documento base64
  createDocumentUrl(base64Data: string, fileName: string): SafeUrl {
    if (!base64Data) return '';
    
    // Determinar el tipo MIME basado en la extensión del archivo
    const extension = fileName.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream';
    
    switch (extension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
    }
    
    // Si ya tiene el prefijo data:, usarlo directamente
    if (base64Data.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustUrl(base64Data);
    }
    
    // Si es solo base64, agregar el prefijo
    const documentUrl = `data:${mimeType};base64,${base64Data}`;
    return this.sanitizer.bypassSecurityTrustUrl(documentUrl);
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

  // Método para verificar si es una imagen
  isImage(mediaType: string): boolean {
    return mediaType === 'PHOTO';
  }

  // Método para verificar si es un video
  isVideo(mediaType: string): boolean {
    return mediaType === 'VIDEO';
  }

  // Método para verificar si es un documento
  isDocument(mediaType: string): boolean {
    return mediaType === 'DOCUMENT';
  }

  // Método para obtener la URL segura del adjunto
  getAttachmentUrl(attachment: any): SafeUrl {
    if (!attachment.data) return '';
    
    if (this.isImage(attachment.mediaType)) {
      return this.createImageUrl(attachment.data);
    } else if (this.isVideo(attachment.mediaType)) {
      return this.createVideoUrl(attachment.data);
    } else if (this.isDocument(attachment.mediaType)) {
      return this.createDocumentUrl(attachment.data, attachment.title);
    }
    
    return '';
  }

  // Método para descargar el archivo
  downloadAttachment(attachment: any): void {
    if (!attachment.data) return;
    
    const url = this.getAttachmentUrl(attachment);
    const link = document.createElement('a');
    link.href = url as string;
    link.download = attachment.title || 'archivo';
    link.click();
  }

  // Método para obtener el tipo de documento
  getDocumentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'Documento Word';
      case 'xls':
      case 'xlsx':
        return 'Hoja de cálculo Excel';
      case 'ppt':
      case 'pptx':
        return 'Presentación PowerPoint';
      case 'txt':
        return 'Archivo de texto';
      default:
        return 'Documento';
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
