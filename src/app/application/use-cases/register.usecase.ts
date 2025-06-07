import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { RegisterVO } from '../../domain/value-objects/auth/register.vo';
import { User } from '../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private repo: AuthRepository) {}

  execute(data: RegisterVO): Observable<User> {
    return this.repo.register(data);
  }
}
