import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDTO } from '@features/register/application/dtos/register-request.dto';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { AuthRepository } from '@core/domain/auth/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(request: RegisterRequestDTO): Observable<RegisterResponseDTO> {
    return this.repository.register(request);
  }
}