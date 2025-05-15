import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { User } from '../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private repo: AuthRepository) {}

  execute(data: NewUserVO): Observable<User> {
    return this.repo.register(data);
  }
}
