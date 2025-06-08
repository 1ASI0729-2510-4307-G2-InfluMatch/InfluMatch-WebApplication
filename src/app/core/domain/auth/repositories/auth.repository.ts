import { Observable } from 'rxjs';
import { RegisterRequestDTO } from '@features/register/application/dtos/register-request.dto';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { LoginRequestDTO } from '@features/login/application/dtos/login-request.dto';
import { LoginResponseDTO } from '@app/features/login/application/dtos/login-response.dto';

export abstract class AuthRepository {
  abstract register(request: RegisterRequestDTO): Observable<RegisterResponseDTO>;
  abstract login(request: LoginRequestDTO): Observable<LoginResponseDTO>;
}
