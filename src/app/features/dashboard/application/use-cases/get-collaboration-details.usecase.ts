import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CollaborationRepositoryImpl } from '../../infrastructure/repositories/collaboration.repository.impl';
import { CollaborationDetail } from '../../domain/models/collaboration.model';

@Injectable({
  providedIn: 'root'
})
export class GetCollaborationDetailsUseCase {
  constructor(
    private collaborationRepository: CollaborationRepositoryImpl
  ) {}

  execute(id: number): Observable<CollaborationDetail> {
    return this.collaborationRepository.getCollaborationById(id);
  }
} 