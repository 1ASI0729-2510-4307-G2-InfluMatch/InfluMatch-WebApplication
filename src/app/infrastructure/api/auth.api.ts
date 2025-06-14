import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';
import { UserAssembler, RegisterResponse } from '../assemblers/user.assembler';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly baseUrl = `${environment.apiBase}/auth`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password, role });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }
}
