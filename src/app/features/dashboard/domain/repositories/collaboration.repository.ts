import { Observable } from 'rxjs';
import { Collaboration, CollaborationListItem, CollaborationResponse } from '../models/collaboration.model';

export interface CollaborationRepository {
  createCollaboration(collaboration: Collaboration): Observable<CollaborationResponse>;
  getCollaborations(): Observable<CollaborationListItem[]>;
} 