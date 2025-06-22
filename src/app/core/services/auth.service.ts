import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly USER_STORAGE_KEY = 'currentUser';

  constructor() {
    // Recuperar usuario del localStorage al iniciar
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    }
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  public getCurrentUserId(): number | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.userId : null;
  }

  public save(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public logout(): void {
    // Limpiar todos los datos de sesión
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('profileType');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');

    // Limpiar el estado del servicio
    this.currentUserSubject.next(null);
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.user_type || '';
  }

  private getCurrentUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}