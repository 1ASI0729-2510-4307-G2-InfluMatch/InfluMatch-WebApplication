import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

interface Attachment {
  title: string;
  description: string;
  mediaType: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  data: string;
}

@Component({
  selector: 'app-attachment-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  template: `
    <div class="attachment-container" [ngClass]="mediaType.toLowerCase()">
      <div class="attachment-header">
        <h3>{{ title }}</h3>
        <p *ngIf="description">{{ description }}</p>
      </div>
      
      <div class="attachment-content" [ngSwitch]="mediaType">
        <!-- Foto -->
        <img *ngSwitchCase="'PHOTO'" [src]="getMediaUrl()" [alt]="title">
        
        <!-- Video -->
        <video *ngSwitchCase="'VIDEO'" controls>
          <source [src]="getMediaUrl()" type="video/mp4">
          {{ 'dashboard.profile.attachments.videoNotSupported' | translate }}
        </video>
        
        <!-- Documento -->
        <div *ngSwitchCase="'DOCUMENT'" class="document-preview">
          <mat-icon>description</mat-icon>
          <a [href]="getMediaUrl()" target="_blank" class="download-button" mat-raised-button color="primary">
            <mat-icon>download</mat-icon>
            {{ 'dashboard.profile.attachments.download' | translate }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .attachment-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }

    .attachment-header {
      padding: 1rem;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #2d3748;
      }

      p {
        margin: 0.5rem 0 0;
        font-size: 0.9rem;
        color: #718096;
      }
    }

    .attachment-content {
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      background: #f7fafc;

      img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
      }

      video {
        max-width: 100%;
        max-height: 400px;
      }
    }

    .document-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #4a5568;
      }

      .download-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    // Estilos específicos por tipo
    .photo .attachment-content {
      background: #000;
      img {
        border-radius: 4px;
      }
    }

    .video .attachment-content {
      background: #000;
    }

    .document {
      .attachment-content {
        background: #f8fafc;
      }
    }
  `]
})
export class AttachmentViewerComponent {
  @Input() title!: string;
  @Input() description?: string;
  @Input() mediaType!: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  @Input() data!: string;

  constructor(private sanitizer: DomSanitizer) {}

  getMediaUrl(): SafeUrl | SafeResourceUrl {
    // Si ya es una URL de datos completa
    if (this.data.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustUrl(this.data);
    }

    // Si es base64, añadir el prefijo correcto según el tipo
    const prefix = this.getMediaTypePrefix();
    const dataUrl = `data:${prefix};base64,${this.data}`;
    return this.sanitizer.bypassSecurityTrustUrl(dataUrl);
  }

  private getMediaTypePrefix(): string {
    switch (this.mediaType) {
      case 'PHOTO':
        return 'image/jpeg';
      case 'VIDEO':
        return 'video/mp4';
      case 'DOCUMENT':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }
} 