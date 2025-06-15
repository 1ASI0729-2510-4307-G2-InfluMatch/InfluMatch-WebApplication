import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CollaborationRepository } from '../../domain/repositories/collaboration.repository';
import { Collaboration, CollaborationListItem, CollaborationResponse } from '../../domain/models/collaboration.model';
import { CreateCollaborationDto, CollaborationListItemDto, CollaborationResponseDTO } from '../dtos/collaboration.dto';
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
} 