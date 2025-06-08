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
import { LoginFacade } from '@features/login/application/facades/login.facade';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatIconModule,
    LanguageSelectorComponent,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [TranslatePipe]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;

  private readonly facade = inject(LoginFacade);
  private readonly snackBar = inject(MatSnackBar);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Ensure translations are loaded
    const currentLang = localStorage.getItem('language') || 'es';
    this.translationService.setLanguage(currentLang).subscribe({
      error: (err) => console.error('Error loading translations:', err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.facade.submit(this.form).pipe(
        tap((response: any) => {
          // Guardar el token y datos del usuario
          localStorage.setItem('user', JSON.stringify({
            userId: response.userId,
            email: response.email,
            role: response.role,
            token: response.token,
            hasProfile: response.hasProfile
          }));
          this.snackBar.open('login.success', 'OK', { duration: 3000 });
          // Redirigir según si tiene perfil o no
          const route = response.hasProfile ? '/dashboard' : '/profile-setup';
          this.router.navigate([route]);
        }),
        catchError((error) => {
          this.snackBar.open(error.message, 'OK', { duration: 3000 });
          throw error;
        })
      ).subscribe();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
