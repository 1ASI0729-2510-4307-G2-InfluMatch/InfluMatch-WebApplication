import { Observable } from 'rxjs';
import { AgendaItem } from '../models/agenda.model';

export abstract class AgendaRepository {
  abstract getAgendaItems(): Observable<AgendaItem[]>;
} 