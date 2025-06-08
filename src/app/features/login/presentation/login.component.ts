import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSelectorComponent } from '@shared/language/language-selector.component';
import { TranslatePipe } from '@shared/translation/translate.pipe';
import { TranslationService } from '@shared/services/translation.service';

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
      // Handle login logic here
      console.log('Form submitted:', this.form.value);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
