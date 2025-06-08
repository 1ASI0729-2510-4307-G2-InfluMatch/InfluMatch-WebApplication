import { Observable } from 'rxjs';
import { RegisterRequestDTO } from '@features/register/application/dtos/register-request.dto';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { User } from '../entities/user.entity';

export abstract class AuthRepository {
  abstract register(request: RegisterRequestDTO): Observable<RegisterResponseDTO>;
}