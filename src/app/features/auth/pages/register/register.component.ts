import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { RegisterUseCase } from '../../../../application/use-cases/register.usecase';
import { AuthService } from '../../../../core/services/auth.service';

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  profileCompleted: boolean;
  userId: number;
  profileType: string;
  name?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-register',
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
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  hidePassword = true;
  currentLang = 'es';
  loading = false;
  private langSubscription: Subscription | null = null;

  roleOptions = [
    { value: 'BRAND', translationKey: 'REGISTER.ACCOUNT_TYPE_BRAND' },
    { value: 'INFLUENCER', translationKey: 'REGISTER.ACCOUNT_TYPE_INFLUENCER' },
  ];

  constructor(
    private fb: FormBuilder,
    private registerUC: RegisterUseCase,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['BRAND', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
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

  onSubmit() {
    if (this.form.valid) {
      const { email, password, role } = this.form.value;
      this.loading = true;
      
      this.registerUC.execute(email, password, role).subscribe({
        next: (response: RegisterResponse) => {
          console.log('Registration successful:', response);
          
          if (!response.profileCompleted) {
            // Store tokens and redirect to onboarding
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userId', response.userId.toString());
            localStorage.setItem('profileType', response.profileType);
            
            this.router.navigate(['/onboarding']);
          } else {
            // Store complete profile data
            localStorage.setItem('userProfile', JSON.stringify(response));
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.showErrorMessage();
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private showErrorMessage(): void {
    this.snack.open(
      this.translate.instant('REGISTER.ERROR'),
      this.translate.instant('REGISTER.CLOSE'),
      {
        duration: 3000,
      }
    );
  }
}
