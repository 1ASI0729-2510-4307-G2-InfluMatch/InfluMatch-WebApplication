import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'current_user';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor() {}

  save(user: User): void {
    // Guardar datos del usuario
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      userId: user.userId,
      name: user.name || '',
      photoUrl: user.photoUrl || '',
      email: user.email || '',
      user_type: user.user_type,
      profileCompleted: user.profileCompleted,
      profileType: user.profileType
    }));

    // Guardar tokens
    localStorage.setItem(this.TOKEN_KEY, user.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, user.refreshToken);
  }

  get currentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    const accessToken = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!userStr || !accessToken || !refreshToken) {
      return null;
    }

    const userData = JSON.parse(userStr);
    return {
      ...userData,
      accessToken,
      refreshToken
    };
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  updateUserData(userData: Partial<User>): void {
    const currentUser = this.currentUser;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.save(updatedUser);
    }
  }
} 