import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';
import { 
  UserAssembler, 
  LoginResponseDTO, 
  RegisterResponseDTO, 
  ProfileResponseDTO 
} from '../assemblers/user.assembler';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  login(creds: UserCredentials): Observable<User> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/api/auth/login`, {
      email: creds.email,
      password: creds.password
    }).pipe(
      map(response => UserAssembler.toUser(response))
    );
  }

  register(data: NewUserVO): Observable<User> {
    const dto = UserAssembler.toNewUserDTO(data);
    return this.http.post<RegisterResponseDTO>(`${this.baseUrl}/users-register`, dto).pipe(
      map(response => UserAssembler.toUserFromRegister(response))
    );
  }

  updateProfile(data: ProfileVO): Observable<User> {
    const dto = UserAssembler.toProfileDTO(data);
    return this.http.put<ProfileResponseDTO>(
      `${this.baseUrl}/users-register/${data.user_id}`, 
      dto
    ).pipe(
      map(response => UserAssembler.toUserFromProfile(response))
    );
  }
}
