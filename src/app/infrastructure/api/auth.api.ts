import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly resource = 'auth';

  private readonly url = `${environment.apiBase}/${this.resource}`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  login(creds: UserCredentials): Observable<User | null> {
    return this.http.post<any>(`${this.url}/login`, creds, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response) {
          return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            profileCompleted: response.profileCompleted,
            userId: response.userId,
            name: response.name,
            photoUrl: response.photoUrl,
            email: response.email,
            user_type: response.user_type || 'marca'
          };
        }
        return null;
      }),
      catchError(this.handleError)
    );
  }

  register(data: NewUserVO): Observable<User> {
    return this.http.post<any>(`${this.url}/register`, data, {
      withCredentials: true
    }).pipe(
      map(response => ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        profileCompleted: response.profileCompleted,
        userId: response.userId,
        name: response.name,
        photoUrl: response.photoUrl,
        email: response.email,
        user_type: response.user_type || 'marca'
      })),
      catchError(this.handleError)
    );
  }

  updateProfile(data: ProfileVO): Observable<User> {
    return this.http.put<any>(`${this.url}/profile`, data, {
      withCredentials: true
    }).pipe(
      map(response => ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        profileCompleted: response.profileCompleted,
        userId: response.userId,
        name: response.name,
        photoUrl: response.photoUrl,
        email: response.email,
        user_type: response.user_type || 'marca'
      })),
      catchError(this.handleError)
    );
  }
}
