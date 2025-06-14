import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { BrandProfileVO } from '../../domain/value-objects/brand-profile.vo';

@Injectable({ providedIn: 'root' })
export class ListBrandsUseCase {
  constructor(private repo: ProfileRepository) {}

  execute(): Observable<BrandProfileVO[]> {
    return this.repo.getBrandProfile().pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }
}
