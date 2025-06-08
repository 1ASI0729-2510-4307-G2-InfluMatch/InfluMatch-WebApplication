import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUserUseCase } from '@core/domain/auth/use-cases/register-user.usecase';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { RegisterRequestDTO } from '@features/register/application/dtos/register-request.dto';
import { Role } from '@core/domain/auth/enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class RegisterFacade {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  submit(form: FormGroup): Observable<RegisterResponseDTO> {
    const payload: RegisterRequestDTO = {
      email: form.get('email')?.value,
      password: form.get('password')?.value,
      role: form.get('userType')?.value as Role,
    };

    return this.registerUseCase.execute(payload);
  }
}