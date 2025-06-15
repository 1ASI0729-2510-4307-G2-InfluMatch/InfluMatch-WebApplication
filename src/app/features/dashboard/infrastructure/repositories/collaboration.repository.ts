import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollaborationRepository } from '../../domain/repositories/collaboration-repository';
import { Collaboration, CollaborationResponse } from '../../domain/models/collaboration.model';
import { CollaborationDTO, CollaborationResponseDTO } from '../dtos/collaboration.dto';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollaborationRepositoryImpl implements CollaborationRepository {
  private readonly API_URL = environment.apiBase;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createCollaboration(collaboration: Collaboration): Observable<CollaborationResponse> {
    const headers = this.getHeaders();
    const dto: CollaborationDTO = {
      counterpartId: collaboration.counterpartId,
      message: collaboration.message,
      actionType: collaboration.actionType,
      targetDate: collaboration.targetDate,
      budget: collaboration.budget,
      milestones: collaboration.milestones,
      location: collaboration.location,
      deliverables: collaboration.deliverables
    };

    return this.http.post<CollaborationResponseDTO>(`${this.API_URL}/collaborations`, dto, { headers })
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
} 