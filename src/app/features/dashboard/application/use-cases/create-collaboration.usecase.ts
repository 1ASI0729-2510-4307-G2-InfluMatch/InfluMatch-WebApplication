import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CollaborationRepositoryImpl } from '../../infrastructure/repositories/collaboration.repository.impl';
import { Collaboration, CollaborationResponse } from '../../domain/models/collaboration.model';

@Injectable({
  providedIn: 'root'
})
export class CreateCollaborationUseCase {
  constructor(private collaborationRepository: CollaborationRepositoryImpl) {}

  execute(collaboration: Collaboration): Observable<CollaborationResponse> {
    return this.collaborationRepository.createCollaboration(collaboration);
  }
} 