import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendaItem } from '../../domain/models/agenda.model';
import { AgendaRepository } from '../../domain/repositories/agenda.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAgendaItemsUseCase {
  constructor(private agendaRepository: AgendaRepository) {}

  execute(): Observable<AgendaItem[]> {
    return this.agendaRepository.getAgendaItems();
  }
} 