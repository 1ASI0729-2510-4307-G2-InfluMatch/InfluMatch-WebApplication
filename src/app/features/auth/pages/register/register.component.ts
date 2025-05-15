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
  form!: FormGroup;
  hidePassword = true;
  currentLang = 'es';
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
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user_type: ['', Validators.required],
      profile_completed: [false], // ← snake_case
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    // Initialize language
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

  submit() {
    if (this.form.invalid) return;

    // desestructuramos para descartar acceptTerms
    const { acceptTerms, ...userData } = this.form.value as {
      name: string;
      email: string;
      password: string;
      user_type: string;
      profile_completed: boolean;
      acceptTerms: boolean;
    };

    const data: NewUserVO = userData;

    this.registerUC.execute(data).subscribe(
      (user) => {
        this.auth.save(user);
        this.snackBar.open(
          this.translate.instant('REGISTER.SUCCESS_MESSAGE'),
          this.translate.instant('LOGIN.CLOSE'),
          { duration: 5000 }
        );

        // 🚀 tras crear la cuenta, si NO completó el perfil...
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
