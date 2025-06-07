import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { RegisterUseCase } from '../../../../application/use-cases/register.usecase';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterVO } from '../../../../domain/value-objects/auth/register.vo';
import { UserRole } from '../../../../infrastructure/dtos/auth/register.dto';
import { passwordValidator } from '../../../../shared/validators/password.validator';

// Interfaz para las opciones de rol
interface RolOption {
  value: UserRole;
  translationKey: string;
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
  form!: FormGroup;
  hide = true;
  currentLang = 'es';
  private langSubscription: Subscription | null = null;

  // Opciones de rol actualizadas
  rolOptions: RolOption[] = [
    { value: 'BRAND', translationKey: 'REGISTER.ROLE_BRAND' },
    { value: 'INFLUENCER', translationKey: 'REGISTER.ROLE_INFLUENCER' },
  ];

  constructor(
    private fb: FormBuilder,
    private registerUC: RegisterUseCase,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      role: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang || 'es';
    this.langSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  changeLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  getPasswordErrorMessage(): string {
    const control = this.form.get('password');
    if (!control?.errors || !control.touched) return '';

    if (control.hasError('required')) {
      return this.translate.instant('REGISTER.PASSWORD_REQUIRED');
    }
    if (control.hasError('minlength')) {
      return this.translate.instant('REGISTER.PASSWORD_MIN_LENGTH');
    }
    if (control.hasError('noUpperCase')) {
      return this.translate.instant('REGISTER.PASSWORD_NO_UPPERCASE');
    }
    if (control.hasError('noLowerCase')) {
      return this.translate.instant('REGISTER.PASSWORD_NO_LOWERCASE');
    }
    if (control.hasError('noNumber')) {
      return this.translate.instant('REGISTER.PASSWORD_NO_NUMBER');
    }
    if (control.hasError('noSpecialChar')) {
      return this.translate.instant('REGISTER.PASSWORD_NO_SPECIAL_CHAR');
    }

    return '';
  }

  submit() {
    if (this.form.invalid) return;

    const { acceptTerms, ...formData } = this.form.value;
    
    const data: RegisterVO = {
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    this.registerUC.execute(data).subscribe(
      (user) => {
        this.auth.save(user);
        this.snackBar.open(
          this.translate.instant('REGISTER.SUCCESS_MESSAGE'),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 5000 }
        );
        this.router.navigateByUrl('/onboarding');
      },
      (error) => {
        this.snackBar.open(
          this.translate.instant('REGISTER.ERROR_MESSAGE'),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 3000 }
        );
      }
    );
  }
}
