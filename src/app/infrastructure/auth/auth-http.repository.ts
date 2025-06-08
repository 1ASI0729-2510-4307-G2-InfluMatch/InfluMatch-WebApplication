import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '@core/domain/auth/repositories/auth.repository';
import { RegisterRequestDTO } from '@features/register/application/dtos/register-request.dto';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpRepository extends AuthRepository {
  constructor(private readonly http: HttpClient) {
    super();
  }

  register(request: RegisterRequestDTO): Observable<RegisterResponseDTO> {
    return this.http.post<RegisterResponseDTO>(`${environment.apiUrl}/auth/register`, request);
  }
}