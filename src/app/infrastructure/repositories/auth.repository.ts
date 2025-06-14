import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthRepository } from '../../domain/repositories/auth-repository';
import { AuthApi } from '../api/auth.api';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl extends AuthRepository {
  constructor(private api: AuthApi) {
    super();
  }

  login(email: string, password: string): Observable<any> {
    return this.api.login(email, password);
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.api.register(email, password, role);
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    return of(null);
  }

  updateProfile(data: any): Observable<any> {
    return this.api.updateProfile(data);
  }
}
