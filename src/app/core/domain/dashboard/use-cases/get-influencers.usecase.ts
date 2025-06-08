import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Influencer } from '../entities/influencer.entity';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable({
  providedIn: 'root'
})
export class GetInfluencersUseCase {
  constructor(private readonly repository: DashboardRepository) {}

  execute(): Observable<Influencer[]> {
    return this.repository.getInfluencers();
  }
} 