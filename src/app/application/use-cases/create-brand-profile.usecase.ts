import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BrandProfileVO, BrandProfileResponseVO } from '../../domain/value-objects/brand-profile.vo';
import { ProfileRepository } from '../../domain/repositories/profile-repository';
import { BrandProfileAssembler } from '../../infrastructure/assemblers/brand-profile.assembler';

@Injectable({ providedIn: 'root' })
export class CreateBrandProfileUseCase {
  constructor(
    private repo: ProfileRepository,
    private assembler: BrandProfileAssembler
  ) {}

  execute(data: BrandProfileVO): Observable<BrandProfileResponseVO> {
    // Validar el perfil
    const errors = this.assembler.validateProfile(data);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join('\n')));
    }

    return this.repo.createBrandProfile(data).pipe(
      map(response => this.assembler.toResponseVO(response)),
      catchError(error => throwError(() => error))
    );
  }
} 