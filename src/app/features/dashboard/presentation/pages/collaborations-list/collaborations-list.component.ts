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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { CollaborationListItem } from '../../../domain/models/collaboration.model';
import { CollaborationListItemDto } from '../../../infrastructure/dtos/collaboration.dto';
import { Router } from '@angular/router';

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
  private readonly apiUrl = 'http://localhost:8080/api';

  statusOptions = [
    { value: 'ALL', label: 'COLLABORATIONS.FILTERS.ALL_STATUS' },
    { value: 'PENDING', label: 'COLLABORATIONS.FILTERS.PENDING' },
    { value: 'ACCEPTED', label: 'COLLABORATIONS.FILTERS.ACCEPTED' },
    { value: 'REJECTED', label: 'COLLABORATIONS.FILTERS.REJECTED' },
    { value: 'FINISHED', label: 'COLLABORATIONS.FILTERS.FINISHED' }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
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
} 