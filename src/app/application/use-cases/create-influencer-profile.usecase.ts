import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { InfluencerProfileVO, InfluencerProfileResponseVO } from '../../domain/value-objects/influencer-profile.vo';
import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { InfluencerProfileAssembler } from '../../infrastructure/assemblers/influencer-profile.assembler';

@Injectable({ providedIn: 'root' })
export class CreateInfluencerProfileUseCase {
  constructor(
    private repo: ProfileRepository,
    private assembler: InfluencerProfileAssembler
  ) {}

  execute(data: InfluencerProfileVO): Observable<InfluencerProfileResponseVO> {
    // Validar el perfil
    const errors = this.assembler.validateProfile(data);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join('\n')));
    }

    return this.repo.createInfluencerProfile(data).pipe(
      map(response => this.assembler.toResponseVO(response)),
      catchError(error => throwError(() => error))
    );
  }
} 