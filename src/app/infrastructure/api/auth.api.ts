import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs'; // 👈 importa map desde rxjs 7+
/* si tu proyecto aún usa rxjs <7:
   import { map } from 'rxjs/operators';
*/

import { environment } from '../../../environments/environment';
import { User } from '../../domain/entities/user.entity';
import { UserCredentials } from '../../domain/value-objects/user-credentials.vo';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly resource = 'users-register';

  private readonly url = `${environment.apiBase}/${this.resource}`;

  constructor(private http: HttpClient) {}

  login(creds: UserCredentials): Observable<User | null> {
    const params = new HttpParams()
      .set('email', creds.email)
      .set('password', creds.password)
      .set('limit', '1');

    return this.http
      .get<User[]>(this.url, { params })
      .pipe(map((users) => (users.length ? users[0] : null)));
  }

  register(data: NewUserVO): Observable<User> {
    return this.http.post<User>(this.url, data);
  }

  updateProfile(data: ProfileVO): Observable<User> {
    return this.http.put<User>(`${this.url}/${data.user_id}`, data);
  }
}
