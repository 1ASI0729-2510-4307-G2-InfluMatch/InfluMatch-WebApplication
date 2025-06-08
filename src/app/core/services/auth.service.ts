import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponseDTO } from '../../infrastructure/dtos/auth/auth-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBase;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(email: string, password: string, role: 'INFLUENCER' | 'BRAND'): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/auth/register`, {
      email,
      password,
      role
    }).pipe(
      tap(response => {
        // Guardar datos de autenticación
        localStorage.setItem('authData', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        
        // Redirigir al onboarding
        this.router.navigate(['/auth/onboarding']);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('authData', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        
        // Si no tiene perfil, redirigir al onboarding
        if (!localStorage.getItem('hasProfile')) {
          this.router.navigate(['/auth/onboarding']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('authData');
    localStorage.removeItem('token');
    localStorage.removeItem('hasProfile');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  hasProfile(): boolean {
    return !!localStorage.getItem('hasProfile');
  }

  getCurrentUser(): AuthResponseDTO | null {
    const authData = localStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
  }

  save(user: AuthResponseDTO): void {
    localStorage.setItem('authData', JSON.stringify(user));
    localStorage.setItem('token', user.token);
  }
}
