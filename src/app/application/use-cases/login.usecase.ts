import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    private repo: AuthRepository,
    private router: Router
  ) {}

  execute(email: string, password: string): Observable<any> {
    return this.repo.login(email, password).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          
          if (!response.profileCompleted) {
            this.router.navigate(['/onboarding']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      })
    );
  }
}
