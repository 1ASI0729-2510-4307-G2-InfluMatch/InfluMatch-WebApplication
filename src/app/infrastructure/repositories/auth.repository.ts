import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthRepository } from '../../domain/repositories/auth-repository';
import { AuthApi } from '../api/auth.api';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { RegisterVO } from '../../domain/value-objects/auth/register.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl extends AuthRepository {
  constructor(private api: AuthApi) {
    super();
  }

  login(creds: UserCredentials): Observable<User | null> {
    return this.api.login(creds);
  }

  register(data: RegisterVO): Observable<User> {
    return this.api.register(data);
  }

  updateProfile(data: ProfileVO): Observable<User> {
    return this.api
      .updateProfile(data)
      .pipe(map((u) => ({ ...u, role: u.user_type, profile_completed: true })));
  }
}
