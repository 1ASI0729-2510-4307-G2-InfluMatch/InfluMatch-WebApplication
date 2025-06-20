import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly baseUrl = `${environment.apiBase}/dashboard`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  listInfluencers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/influencers`, {
      headers: this.getHeaders(),
    });
  }

  listBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/brands`, {
      headers: this.getHeaders(),
    });
  }
} 