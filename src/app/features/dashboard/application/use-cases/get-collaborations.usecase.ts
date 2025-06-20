import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CollaborationRepositoryImpl } from '../../infrastructure/repositories/collaboration.repository.impl';
import { CollaborationListItem } from '../../domain/models/collaboration.model';

@Injectable({
  providedIn: 'root'
})
export class GetCollaborationsUseCase {
  constructor(
    private collaborationRepository: CollaborationRepositoryImpl
  ) {}

  execute(): Observable<CollaborationListItem[]> {
    return this.collaborationRepository.getCollaborations();
  }
} 