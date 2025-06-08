import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUserUseCase } from '@core/domain/auth/use-cases/register-user.usecase';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterFacade {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  submit(form: FormGroup): Observable<RegisterResponseDTO> {
    return this.registerUseCase.execute({
      email: form.get('email')?.value,
      password: form.get('password')?.value,
      role: form.get('role')?.value,
    });
  }
}