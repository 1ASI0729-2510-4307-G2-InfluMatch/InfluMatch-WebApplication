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
import { AuthService } from '../../../../core/services/auth.service';
import { UserCredentials } from '../../../../domain/value-objects/user-credentials.vo';

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
  form!: FormGroup;
  hide = true;
  currentLang = 'es';
  private langSubscription: Subscription | null = null;

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
      password: ['', Validators.required],
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

  submit(): void {
    if (this.form.invalid) return;

    const creds = this.form.value as UserCredentials;
    this.loginUC.execute(creds).subscribe({
      next: (user) => {
        if (user) {
          this.auth.save(user);
          if (!user.profileCompleted) {
            this.router.navigateByUrl('/onboarding');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        } else {
          this.showErrorMessage('Credenciales inválidas');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 403) {
          this.showErrorMessage('Acceso denegado. Por favor, verifica tus credenciales.');
        } else {
          this.showErrorMessage('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
      }
    });
  }

  private showErrorMessage(message: string): void {
    this.snack.open(
      message,
      this.translate.instant('LOGIN.CLOSE'),
      {
        duration: 3000,
      }
    );
  }
}
