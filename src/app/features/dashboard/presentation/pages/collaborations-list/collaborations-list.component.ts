import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { CollaborationListItem } from '../../../domain/models/collaboration.model';
import { CollaborationListItemDto } from '../../../infrastructure/dtos/collaboration.dto';
import { Router } from '@angular/router';
import { CollaborationActionService } from '../../../infrastructure/services/collaboration-action.service';
import { CollaborationStatusUtils, CollaborationStatus } from '../../../../../shared/utils/collaboration-status.utils';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../infrastructure/services/auth.service';
import { CollaborationConfirmationModalComponent, CollaborationConfirmationData } from '../collaboration-confirmation-modal/collaboration-confirmation-modal.component';

@Component({
  selector: 'app-collaborations-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './collaborations-list.component.html',
  styleUrls: ['./collaborations-list.component.scss']
})
export class CollaborationsListComponent implements OnInit {
  collaborations: CollaborationListItem[] = [];
  filteredCollaborations: CollaborationListItem[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = 'ALL';
  private readonly apiUrl = environment.apiBase;

  statusOptions = [
    { value: 'ALL', label: 'COLLABORATIONS.FILTERS.ALL_STATUS' },
    { value: 'PENDING', label: 'COLLABORATIONS.FILTERS.PENDING' },
    { value: 'ACCEPTED', label: 'COLLABORATIONS.FILTERS.ACCEPTED' },
    { value: 'REJECTED', label: 'COLLABORATIONS.FILTERS.REJECTED' },
    { value: 'CANCELED', label: 'COLLABORATIONS.FILTERS.CANCELED' },
    { value: 'FINISHED', label: 'COLLABORATIONS.FILTERS.FINISHED' }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private collaborationActionService: CollaborationActionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCollaborations();
  }

  loadCollaborations(): void {
    this.loading = true;
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<CollaborationListItemDto[]>(`${this.apiUrl}/collaborations`, { headers })
      .pipe(
        map((response: CollaborationListItemDto[]) => {
          return response.map(item => ({
            id: item.id,
            initiatorId: item.initiatorId,
            counterpartId: item.counterpartId,
            initiatorRole: item.initiatorRole,
            status: item.status,
            counterpartName: item.counterpartName,
            counterpartPhotoUrl: item.counterpartPhotoUrl,
            message: item.message,
            actionType: item.actionType,
            createdAt: item.createdAt
          }));
        })
      )
      .subscribe({
        next: (collaborations) => {
          this.collaborations = collaborations;
          this.filterCollaborations();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading collaborations:', error);
          this.snackBar.open(
            this.translate.instant('COLLABORATIONS.ERROR_LOADING'),
            this.translate.instant('LOGIN.CLOSE'),
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
          this.loading = false;
        }
      });
  }

  filterCollaborations(): void {
    this.filteredCollaborations = this.collaborations.filter(collaboration => {
      const matchesSearch = collaboration.counterpartName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           collaboration.message.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'ALL' || collaboration.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterCollaborations();
  }

  onStatusChange(): void {
    this.filterCollaborations();
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

  viewCollaborationDetails(collaborationId: number): void {
    console.log('Navegando a detalles de colaboración:', collaborationId);
    console.log('URL de navegación:', `/dashboard/collaborations/${collaborationId}`);
    
    this.router.navigate(['/dashboard/collaborations', collaborationId]).then(success => {
      console.log('Navegación exitosa:', success);
    }).catch(error => {
      console.error('Error en navegación:', error);
    });
  }

  openConfirmationModal(collaboration: CollaborationListItem): void {
    const currentUserId = this.getCurrentUserId();
    
    const dialogRef = this.dialog.open(CollaborationConfirmationModalComponent, {
      data: {
        collaboration: collaboration,
        currentUserId: currentUserId
      } as CollaborationConfirmationData,
      width: '600px',
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadCollaborations(); // Recargar la lista después de una acción exitosa
      }
    });
  }

  getCurrentUserId(): number {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.userId) {
      return currentUser.userId;
    }
    
    console.warn('No se pudo obtener el ID del usuario actual');
    return 0;
  }

  shouldShowConfirmationButton(collaboration: CollaborationListItem): boolean {
    const currentUserId = this.getCurrentUserId();
    const shouldShow = this.collaborationActionService.shouldShowActionButton(collaboration, currentUserId);
    
    console.log('Debug shouldShowConfirmationButton:', {
      collaborationId: collaboration.id,
      collaborationStatus: collaboration.status,
      currentUserId: currentUserId,
      counterpartId: collaboration.counterpartId,
      initiatorId: collaboration.initiatorId,
      shouldShow: shouldShow
    });
    
    return shouldShow;
  }

  getConfirmationButtonText(collaboration: CollaborationListItem): string {
    const currentUserId = this.getCurrentUserId();
    const userRole = this.collaborationActionService.getUserRole(collaboration, currentUserId);
    
    if (collaboration.status === 'PENDING') {
      if (userRole === 'RECIPIENT') {
        return 'COLLABORATIONS.LIST.CONFIRM_PROCESS';
      } else if (userRole === 'INITIATOR') {
        return 'COLLABORATIONS.LIST.CANCEL_COLLABORATION';
      }
    } else if (collaboration.status === 'ACCEPTED' && userRole === 'INITIATOR') {
      return 'COLLABORATIONS.LIST.FINISH_COLLABORATION';
    }
    
    return 'COLLABORATIONS.LIST.CONFIRM_PROCESS';
  }

  getConfirmationButtonIcon(collaboration: CollaborationListItem): string {
    const currentUserId = this.getCurrentUserId();
    const userRole = this.collaborationActionService.getUserRole(collaboration, currentUserId);
    
    if (collaboration.status === 'PENDING') {
      if (userRole === 'RECIPIENT') {
        return 'assignment';
      } else if (userRole === 'INITIATOR') {
        return 'cancel';
      }
    } else if (collaboration.status === 'ACCEPTED' && userRole === 'INITIATOR') {
      return 'done_all';
    }
    
    return 'assignment';
  }

  getConfirmationButtonColor(collaboration: CollaborationListItem): string {
    const currentUserId = this.getCurrentUserId();
    const userRole = this.collaborationActionService.getUserRole(collaboration, currentUserId);
    
    if (collaboration.status === 'PENDING') {
      if (userRole === 'RECIPIENT') {
        return 'primary';
      } else if (userRole === 'INITIATOR') {
        return 'warn';
      }
    } else if (collaboration.status === 'ACCEPTED' && userRole === 'INITIATOR') {
      return 'primary';
    }
    
    return 'primary';
  }
} 