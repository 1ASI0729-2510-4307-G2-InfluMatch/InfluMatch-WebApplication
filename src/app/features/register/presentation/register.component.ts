import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from '@shared/language/language-selector.component';
import { TranslatePipe } from '@shared/translation/translate.pipe';
import { TranslationService } from '@shared/services/translation.service';
import { RegisterFacade } from '@features/register/application/facades/register.facade';
import { catchError, tap } from 'rxjs/operators';
import { Role } from '@core/domain/auth/enums/role.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatIconModule,
    LanguageSelectorComponent,
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [TranslatePipe]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  readonly Role = Role; // Para usar en el template

  private readonly facade = inject(RegisterFacade);
  private readonly snackBar = inject(MatSnackBar);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      userType: [Role.BRAND, [Validators.required]] // Valor por defecto: BRAND
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Ensure translations are loaded
    const currentLang = localStorage.getItem('language') || 'es';
    this.translationService.setLanguage(currentLang).subscribe({
      error: (err) => console.error('Error loading translations:', err)
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.facade.submit(this.form).pipe(
        tap((response) => {
          // Guardar el token y datos del usuario
          localStorage.setItem('user', JSON.stringify({
            userId: response.userId,
            email: response.email,
            role: response.role,
            token: response.token,
            hasProfile: false // Usuario recién registrado no tiene perfil
          }));
          this.snackBar.open('register.success', 'OK', { duration: 3000 });
          this.router.navigate(['/profile-setup']);
        }),
        catchError((error) => {
          this.snackBar.open(error.message, 'OK', { duration: 3000 });
          throw error;
        })
      ).subscribe();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
