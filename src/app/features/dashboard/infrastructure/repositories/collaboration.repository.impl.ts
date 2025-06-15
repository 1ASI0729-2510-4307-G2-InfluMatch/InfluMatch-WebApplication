import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CollaborationRepository } from '../../domain/repositories/collaboration.repository';
import { Collaboration, CollaborationListItem, CollaborationResponse, CollaborationDetail } from '../../domain/models/collaboration.model';
import { CreateCollaborationDto, CollaborationListItemDto, CollaborationResponseDTO, CollaborationDetailDto } from '../dtos/collaboration.dto';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaborationRepositoryImpl implements CollaborationRepository {
  private readonly apiUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  createCollaboration(collaboration: Collaboration): Observable<CollaborationResponse> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const dto: CreateCollaborationDto = {
      counterpartId: collaboration.counterpartId,
      message: collaboration.message,
      actionType: collaboration.actionType,
      targetDate: collaboration.targetDate,
      budget: collaboration.budget,
      milestones: collaboration.milestones,
      location: collaboration.location,
      deliverables: collaboration.deliverables
    };

    return this.http.post<CollaborationResponseDTO>(`${this.apiUrl}/collaborations`, dto, { headers })
      .pipe(
        map((response: CollaborationResponseDTO): CollaborationResponse => ({
          id: response.id,
          status: response.status,
          message: response.message,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        }))
      );
  }

  getCollaborations(): Observable<CollaborationListItem[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<CollaborationListItemDto[]>(`${this.apiUrl}/collaborations`, { headers })
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
      );
  }

  getCollaborationById(id: number): Observable<CollaborationDetail> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<CollaborationDetailDto>(`${this.apiUrl}/collaborations/${id}`, { headers })
      .pipe(
        map((response: CollaborationDetailDto): CollaborationDetail => ({
          id: response.id,
          status: response.status,
          initiatorRole: response.initiatorRole,
          counterpart: {
            id: response.counterpart.id,
            name: response.counterpart.name,
            photoUrl: response.counterpart.photoUrl
          },
          message: response.message,
          actionType: response.actionType,
          targetDate: response.targetDate,
          budget: response.budget,
          milestones: response.milestones,
          location: response.location,
          deliverables: response.deliverables,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        }))
      );
  }
} 