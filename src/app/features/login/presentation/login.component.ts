import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

import { MaterialModule } from '@shared/material/material.module';
import { TranslationModule } from '@shared/translation/translation.module';
import { LoginFacade } from '@features/login/application/facades/login.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb   = inject(FormBuilder);
  private readonly fac  = inject(LoginFacade);
  private readonly snack= inject(MatSnackBar);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.fac.submit(this.form).pipe(
      tap(() =>
        this.snack.open($localize`Login exitoso`, undefined, { duration: 2500 })
      ),
      catchError(err => {
        this.snack.open($localize`Error en el login`, undefined, { duration: 2500 });
        throw err;
      })
    ).subscribe();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
