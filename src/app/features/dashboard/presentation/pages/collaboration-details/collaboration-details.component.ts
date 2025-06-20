import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GetCollaborationDetailsUseCase } from '../../../application/use-cases/get-collaboration-details.usecase';
import { CollaborationDetail } from '../../../domain/models/collaboration.model';

@Component({
  selector: 'app-collaboration-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './collaboration-details.component.html',
  styleUrls: ['./collaboration-details.component.scss']
})
export class CollaborationDetailsComponent implements OnInit {
  collaboration: CollaborationDetail | null = null;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getCollaborationDetailsUseCase: GetCollaborationDetailsUseCase,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    console.log('CollaborationDetailsComponent constructor llamado');
  }

  ngOnInit(): void {
    this.loadCollaborationDetails();
  }

  loadCollaborationDetails(): void {
    this.loading = true;
    this.error = false;
    
    const collaborationId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Cargando detalles de colaboración con ID:', collaborationId);
    
    if (!collaborationId) {
      this.error = true;
      this.loading = false;
      this.snackBar.open(
        this.translate.instant('COLLABORATIONS.DETAILS.ERROR_INVALID_ID'),
        this.translate.instant('LOGIN.CLOSE'),
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      return;
    }

    this.getCollaborationDetailsUseCase.execute(collaborationId).subscribe({
      next: (collaboration) => {
        console.log('Detalles de colaboración cargados:', collaboration);
        this.collaboration = collaboration;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collaboration details:', error);
        this.error = true;
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('COLLABORATIONS.DETAILS.ERROR_LOADING'),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'ACCEPTED': return 'primary';
      case 'REJECTED': return 'accent';
      case 'FINISHED': return 'primary';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'schedule';
      case 'ACCEPTED': return 'check_circle';
      case 'REJECTED': return 'cancel';
      case 'FINISHED': return 'done_all';
      default: return 'help';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getActionTypeLabel(actionType: string): string {
    return this.translate.instant(`COLLABORATIONS.ACTION_TYPES.${actionType}`);
  }

  getImageUrl(photoUrl: string | null): string {
    if (!photoUrl) {
      return 'assets/images/default-avatar.svg';
    }
    
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    if (photoUrl.startsWith('data:')) {
      return photoUrl;
    }
    
    return `data:image/jpeg;base64,${photoUrl}`;
  }

  hideImage(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/collaborations']);
  }
} 