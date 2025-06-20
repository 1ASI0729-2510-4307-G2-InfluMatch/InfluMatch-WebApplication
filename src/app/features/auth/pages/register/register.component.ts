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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RegisterUseCase } from '../../../../application/use-cases/register.usecase';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { User } from '../../../../domain/entities/user.entity';

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
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  error: string | null = null;
  currentLang = 'es';
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
    this.registerForm = this.fb.group({
      email: ['', []],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator.bind(this)
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

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    if (!control) return false;

    if (field === 'email') {
      // For email field, only show validation errors after submit attempt
      return control.invalid && control.errors !== null && control.touched;
    }
    // For other fields, keep the normal validation behavior
    return control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (!control) return '';

    if (control.hasError('required')) {
      return `auth.register.errors.${field}.required`;
    }
    if (control.hasError('email')) {
      return 'auth.register.errors.email.invalid';
    }
    if (control.hasError('minlength')) {
      return 'auth.register.errors.password.minLength';
    }
    if (field === 'confirmPassword' && this.registerForm.hasError('mismatch')) {
      return 'auth.register.errors.confirmPassword.mismatch';
    }

    return '';
  }

  onSubmit() {
    // Add email validation on submit
    const emailControl = this.registerForm.get('email');
    if (emailControl) {
      emailControl.setValidators([Validators.required, Validators.email]);
      emailControl.updateValueAndValidity();
    }

    // Validate form and show all errors
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    // Force validation of confirmPassword when submitting
    if (this.registerForm.get('password')?.value) {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    }

    // Debug: Show form state only on submit
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form errors:', this.registerForm.errors);
    console.log('Form value:', this.registerForm.value);

    if (this.registerForm.valid) {
      this.loading = true;
      const { email, password, role } = this.registerForm.value;
      
      // Ensure role is either BRAND or INFLUENCER
      if (role !== 'BRAND' && role !== 'INFLUENCER') {
        this.snack.open(
          this.translate.instant('auth.register.errors.invalid_role'),
          this.translate.instant('auth.register.close'),
          { duration: 3000 }
        );
        this.loading = false;
        return;
      }

      this.registerUC.execute(email, password, role).subscribe({
        next: (response: RegisterResponse) => {
          console.log('Registration successful:', response);
          
          // Map response to User entity
          const user: User = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            profileCompleted: response.profileCompleted,
            userId: response.userId,
            name: response.name || '',
            photoUrl: response.photoUrl || '',
            email: email,
            user_type: role === 'BRAND' ? 'marca' : 'influencer',
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