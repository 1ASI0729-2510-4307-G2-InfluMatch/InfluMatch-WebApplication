import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { ProfileVO } from '../../domain/value-objects/profile.vo';
import { User } from '../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class UpdateProfileUseCase {
  constructor(private repo: AuthRepository) {}

  execute(data: ProfileVO): Observable<User> {
    return this.repo.updateProfile(data);
  }
}
