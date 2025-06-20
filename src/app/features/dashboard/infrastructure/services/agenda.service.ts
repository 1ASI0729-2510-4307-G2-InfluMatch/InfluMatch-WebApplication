import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AgendaItem } from '../../domain/models/agenda.model';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private readonly apiUrl = `${environment.apiBase}/collaborations/agenda`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAgendaItems(): Observable<AgendaItem[]> {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !currentUser.accessToken) {
      throw new Error('Usuario no autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser.accessToken}`
    });

    return this.http.get<AgendaItem[]>(this.apiUrl, { headers }).pipe(
      map(response => {
        // Assuming the response from the API matches the AgendaItem interface directly
        return response;
      })
    );
  }
} 