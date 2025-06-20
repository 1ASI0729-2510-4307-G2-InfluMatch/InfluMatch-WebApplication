import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../infrastructure/services/auth.service';

export type CollaborationAction = 'ACCEPT' | 'REJECT' | 'CANCEL' | 'FINISH';

export interface CollaborationActionRequest {
  action: CollaborationAction;
}

export interface CollaborationActionResponse {
  success: boolean;
  message?: string;
  collaborationId: number;
  newStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborationActionService {
  private readonly apiUrl = `${environment.apiBase}/collaborations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  executeAction(collaborationId: number, action: CollaborationAction): Observable<CollaborationActionResponse> {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !currentUser.accessToken) {
      throw new Error('Usuario no autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser.accessToken}`,
      'Content-Type': 'application/json'
    });

    const request: CollaborationActionRequest = { action };

    return this.http.put<CollaborationActionResponse>(
      `${this.apiUrl}/${collaborationId}`,
      request,
      { headers }
    );
  }

  canExecuteAction(
    status: string, 
    userRole: 'RECIPIENT' | 'INITIATOR', 
    action: CollaborationAction
  ): boolean {
    const availableActions = this.getAvailableActions(status, userRole);
    return availableActions.includes(action);
  }

  getAvailableActions(status: string, userRole: 'RECIPIENT' | 'INITIATOR'): CollaborationAction[] {
    if (status === 'PENDING') {
      if (userRole === 'RECIPIENT') {
        return ['ACCEPT', 'REJECT'];
      } else if (userRole === 'INITIATOR') {
        return ['CANCEL'];
      }
    } else if (status === 'ACCEPTED' && userRole === 'INITIATOR') {
      return ['FINISH'];
    }
    return [];
  }

  getUserRole(collaboration: any, currentUserId: number): 'RECIPIENT' | 'INITIATOR' | 'NONE' {
    if (collaboration.counterpartId === currentUserId) {
      return 'RECIPIENT';
    } else if (collaboration.initiatorId === currentUserId) {
      return 'INITIATOR';
    }
    return 'NONE';
  }

  shouldShowActionButton(collaboration: any, currentUserId: number): boolean {
    const userRole = this.getUserRole(collaboration, currentUserId);
    
    if (userRole === 'NONE') {
      return false;
    }

    const actionableStatuses = ['PENDING', 'ACCEPTED'];
    if (!actionableStatuses.includes(collaboration.status)) {
      return false;
    }

    const availableActions = this.getAvailableActions(collaboration.status, userRole);
    return availableActions.length > 0;
  }
} 