import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CollaborationListItem } from '../../../domain/models/collaboration.model';
import { environment } from '../../../../../../environments/environment';
import { CollaborationStatusUtils, CollaborationStatus } from '../../../../../shared/utils/collaboration-status.utils';

export interface CollaborationConfirmationData {
  collaboration: CollaborationListItem;
  currentUserId: number;
}

@Component({
  selector: 'app-collaboration-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './collaboration-confirmation-modal.component.html',
  styleUrls: ['./collaboration-confirmation-modal.component.scss']
})
export class CollaborationConfirmationModalComponent implements OnInit {
  loading = false;
  currentUserId: number;
  collaboration: CollaborationListItem;
  userRole: 'RECIPIENT' | 'INITIATOR' | 'NONE' = 'NONE';
  availableActions: string[] = [];
  private readonly apiUrl = environment.apiBase;

  constructor(
    public dialogRef: MatDialogRef<CollaborationConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CollaborationConfirmationData,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.collaboration = data.collaboration;
    this.currentUserId = data.currentUserId;
  }

  ngOnInit(): void {
    this.determineUserRole();
    this.setAvailableActions();
  }

  private determineUserRole(): void {
    if (this.collaboration.counterpartId === this.currentUserId) {
      this.userRole = 'RECIPIENT';
    } else if (this.collaboration.initiatorId === this.currentUserId) {
      this.userRole = 'INITIATOR';
    } else {
      this.userRole = 'NONE';
    }
  }

  private setAvailableActions(): void {
    this.availableActions = [];

    if (this.collaboration.status === 'PENDING') {
      if (this.userRole === 'RECIPIENT') {
        this.availableActions = ['ACCEPT', 'REJECT'];
      } else if (this.userRole === 'INITIATOR') {
        this.availableActions = ['CANCEL'];
      }
    } else if (this.collaboration.status === 'ACCEPTED') {
      if (this.userRole === 'INITIATOR') {
        this.availableActions = ['FINISH'];
      }
    }
  }

  canShowActionButton(): boolean {
    return this.userRole !== 'NONE' && this.availableActions.length > 0;
  }

  getStatusColor(status: string): string {
    return CollaborationStatusUtils.getStatusColor(status as CollaborationStatus);
  }

  getStatusIcon(status: string): string {
    return CollaborationStatusUtils.getStatusIcon(status as CollaborationStatus);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getActionTypeLabel(actionType: string): string {
    return this.translate.instant(`COLLABORATIONS.ACTION_TYPES.${actionType}`);
  }

  hideImage(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  getImageUrl(photoUrl: string | null): string {
    if (!photoUrl) {
      return 'assets/images/default-avatar.svg'; // Imagen por defecto
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // Si es base64, devolverla con el prefijo data:image
    if (photoUrl.startsWith('data:')) {
      return photoUrl;
    }
    
    // Si es solo base64 sin prefijo, agregar el prefijo
    return `data:image/jpeg;base64,${photoUrl}`;
  }

  async executeAction(action: string): Promise<void> {
    this.loading = true;
    
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(
      `${this.apiUrl}/collaborations/${this.collaboration.id}`,
      { action },
      { headers }
    ).subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant(`COLLABORATIONS.ACTIONS.${action}_SUCCESS`),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 3000, panelClass: ['success-snackbar'] }
        );

        this.dialogRef.close({ action, success: true });
      },
      error: (error) => {
        console.error(`Error executing action ${action}:`, error);
        this.snackBar.open(
          this.translate.instant(`COLLABORATIONS.ACTIONS.${action}_ERROR`),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
} 