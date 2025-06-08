import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '@core/domain/auth/repositories/auth.repository';
import { LoginRequestDTO } from '@features/login/application/dtos/login-request.dto';
import { LoginResponseDTO } from '@app/features/login/application/dtos/login-response.dto';

@Injectable({ providedIn: 'root' })
export class LoginUserUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(request: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.repository.login(request);
  }
}
