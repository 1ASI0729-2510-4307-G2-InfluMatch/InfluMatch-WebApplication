import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { AgendaRepository } from '../../domain/repositories/agenda.repository';
import { AgendaItem } from '../../domain/models/agenda.model';
import { AgendaItemDto } from '../dtos/agenda.dto';
import { AgendaAssembler } from '../assemblers/agenda.assembler';

@Injectable({
  providedIn: 'root'
})
export class AgendaRepositoryImpl extends AgendaRepository {
  private readonly apiUrl = `${environment.apiBase}/collaborations/agenda`;
  private readonly assembler = new AgendaAssembler();

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
  }

  getAgendaItems(): Observable<AgendaItem[]> {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !currentUser.accessToken) {
      throw new Error('Usuario no autenticado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser.accessToken}`
    });

    return this.http.get<AgendaItemDto[]>(this.apiUrl, { headers }).pipe(
      map(dtos => this.assembler.toDomainList(dtos))
    );
  }
} 