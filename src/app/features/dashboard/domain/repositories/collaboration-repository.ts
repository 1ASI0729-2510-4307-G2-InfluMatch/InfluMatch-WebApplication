import { Observable } from 'rxjs';
import { Collaboration, CollaborationResponse } from '../models/collaboration.model';
 
export interface CollaborationRepository {
  createCollaboration(collaboration: Collaboration): Observable<CollaborationResponse>;
} 