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

  public save(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }
}
