import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InfluencerProfileVO } from '../../domain/value-objects/influencer-profile.vo';
import { ProfileRepository } from '../../domain/repositories/profile-repository';

@Injectable({ providedIn: 'root' })
export class ListInfluencersUseCase {
  constructor(private repo: ProfileRepository) {}

  execute(): Observable<InfluencerProfileVO[]> {
    return this.repo.getInfluencerProfile().pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }
}
