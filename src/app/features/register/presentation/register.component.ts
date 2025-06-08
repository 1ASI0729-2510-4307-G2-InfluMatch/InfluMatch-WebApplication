import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterFacade } from '@features/register/application/facades/register.facade';
import { MaterialModule } from '@shared/material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { TranslationModule } from '@shared/translation/translation.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslationModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(RegisterFacade);
  private readonly snack = inject(MatSnackBar);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['BRAND', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.facade
      .submit(this.form)
      .pipe(
        tap(() => this.snack.open($localize`Registro exitoso`, undefined, { duration: 2500 })),
        catchError((err) => {
          this.snack.open($localize`Error en el registro`, undefined, { duration: 2500 });
          throw err;
        }),
      )
      .subscribe();
  }
}