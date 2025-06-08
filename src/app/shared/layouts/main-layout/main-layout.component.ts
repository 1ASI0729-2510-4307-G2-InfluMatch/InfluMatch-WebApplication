import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../translation/translate.pipe';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '../../translation/translate.service';
import { AuthService } from '../../../core/services/auth.service';

interface User {
  email: string;
  // Add other user properties if needed
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TranslatePipe
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly authService = inject(AuthService);
  
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  userEmail: string = '';
  currentLanguage: string = 'es';

  constructor() {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo) as User;
        this.userEmail = user.email;
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    this.currentLanguage = this.translateService.getCurrentLang();
  }

  toggleLanguage() {
    const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
    this.translateService.use(newLang);
    this.currentLanguage = newLang;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Even if the API call fails, we should still clear local storage and redirect
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
} 