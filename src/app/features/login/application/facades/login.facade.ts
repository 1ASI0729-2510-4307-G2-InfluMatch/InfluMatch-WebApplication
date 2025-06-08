import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginUserUseCase } from '@core/domain/auth/use-cases/login-user.usecase';
import { LoginResponseDTO } from '../dtos/login-response.dto';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  constructor(private readonly loginUseCase: LoginUserUseCase) {}

  submit(form: FormGroup): Observable<LoginResponseDTO> {
    return this.loginUseCase.execute({
      email: form.get('email')?.value,
      password: form.get('password')?.value,
    });
  }
}
