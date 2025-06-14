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
import { NewUserVO } from '../../../../domain/value-objects/new-user.vo';

// Interfaz para las opciones de rol
interface RolOption {
  value: string; // Valor que se enviará al backend (siempre en español)
  translationKey: string; // Clave para la traducción
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

  rolOptions: RolOption[] = [
    { value: 'influencer', translationKey: 'REGISTER.ACCOUNT_TYPE_INFLUENCER' },
    { value: 'marca', translationKey: 'REGISTER.ACCOUNT_TYPE_BRAND' },
  ];
  // Opciones de rol (siempre en español)

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

  submit(): void {
    if (this.form.invalid) {
      console.log('Form invalid:', this.form.errors);
      console.log('Form values:', this.form.value);
      return;
    }

    this.loading = true;
    const { acceptTerms, ...userData } = this.form.value;
    
    const data: NewUserVO = {
      email: userData.email,
      password: userData.password,
      role: userData.role
    };

    this.registerUC.execute(data).subscribe({
      next: (user) => {
        if (user) {
          this.auth.save(user);
          this.router.navigateByUrl('/onboarding');
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.showErrorMessage();
      },
      complete: () => {
        this.loading = false;
      }
    });
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
