import { AgendaItemDto } from '../dtos/agenda.dto';
import { AgendaItem } from '../../domain/models/agenda.model';

export class AgendaAssembler {
  toDomain(dto: AgendaItemDto): AgendaItem {
    return {
      collaborationId: dto.collaborationId,
      initiatorId: dto.initiatorId,
      counterpartId: dto.counterpartId,
      date: dto.date,
      eventTitle: dto.eventTitle,
      description: dto.description,
      location: dto.location,
      counterpartName: dto.counterpartName,
    };
  }

  toDomainList(dtos: AgendaItemDto[]): AgendaItem[] {
    return dtos.map(dto => this.toDomain(dto));
  }
} 