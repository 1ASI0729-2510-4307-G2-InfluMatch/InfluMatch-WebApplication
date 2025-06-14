import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LoginUseCase } from '../../../../application/use-cases/login.usecase';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { User } from '../../../../domain/entities/user.entity';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profileCompleted: boolean;
  userId: number;
  profileType: string;
  name?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  hidePassword = true;
  currentLang = 'es';
  loading = false;
  hide = true;
  private langSubscription: Subscription | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginUC: LoginUseCase,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.auth.currentUser) {
      this.router.navigate(['/dashboard']);
    }
    // Initialize language
    this.currentLang = this.translate.currentLang || 'es';
    this.langSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  changeLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const { email, password } = this.form.value;
      
      this.loginUC.execute(email, password).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);
          
          // Map response to User entity
          const user: User = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            profileCompleted: response.profileCompleted,
            userId: response.userId,
            name: response.name || '',
            photoUrl: response.photoUrl || '',
            email: email,
            user_type: response.profileType === 'BRAND' ? 'marca' : 'influencer',
            profileType: response.profileType as 'BRAND' | 'INFLUENCER'
          };
          
          this.auth.save(user);
          
          if (!response.profileCompleted) {
            this.router.navigate(['/onboarding']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error during login';
          this.showErrorMessage();
        }
      });
    }
  }

  private showErrorMessage(): void {
    this.snack.open(
      this.translate.instant('LOGIN.ERROR'),
      this.translate.instant('LOGIN.CLOSE'),
      {
        duration: 3000,
      }
    );
  }
}
