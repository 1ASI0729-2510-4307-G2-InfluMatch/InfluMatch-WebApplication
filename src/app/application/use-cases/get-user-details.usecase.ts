import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetUserDetailsUseCase {
  private readonly apiUrl = `${environment.apiBase}/users-register`;

  constructor(private http: HttpClient) {}

  execute(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
