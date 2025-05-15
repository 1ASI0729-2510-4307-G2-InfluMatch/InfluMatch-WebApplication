import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { AuthRepository } from '../../domain/repositories/auth-repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(creds: UserCredentials): Observable<User | null> {
    return this.repo.login(creds);
  }
}
