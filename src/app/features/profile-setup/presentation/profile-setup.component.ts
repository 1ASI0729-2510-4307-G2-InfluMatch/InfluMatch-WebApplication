import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { MaterialModule } from '@shared/material/material.module';
import { ProfileSetupFacade } from '../application/facades/profile-setup.facade';
import { InfluencerProfileRequestDTO } from '../application/dtos/influencer-profile-request.dto';
import { BrandProfileRequestDTO } from '../application/dtos/brand-profile-request.dto';
import { LanguageSelectorComponent } from '@shared/language/language-selector.component';
import { TranslatePipe } from '@shared/translation/translate.pipe';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    LanguageSelectorComponent,
    TranslatePipe
  ],
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss']
})
export class ProfileSetupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProfileSetupFacade);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  currentStep = 1;
  totalSteps = 3;
  userRole: string = '';
  
  influencerForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    bio: ['', [Validators.required, Validators.maxLength(255)]],
    category: ['', Validators.required],
    country: ['', Validators.required],
    followersCount: [0, [Validators.required, Validators.min(0)]]
  });

  brandForm = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', Validators.maxLength(255)],
    industry: ['', Validators.maxLength(50)],
    websiteUrl: ['', Validators.pattern('https?://.*')],
    logoUrl: ['', Validators.pattern('https?://.*')]
  });

  ngOnInit() {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.userRole = user.role;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitInfluencerProfile() {
    if (this.influencerForm.invalid) return;

    const formValue = this.influencerForm.getRawValue();
    const request: InfluencerProfileRequestDTO = {
      displayName: formValue.displayName,
      bio: formValue.bio,
      category: formValue.category,
      country: formValue.country,
      followersCount: formValue.followersCount
    };

    this.facade.createInfluencerProfile(request).pipe(
      tap(() => {
        this.snack.open($localize`Perfil creado exitosamente`, undefined, { duration: 2500 });
        this.router.navigate(['/dashboard']);
      }),
      catchError(err => {
        this.snack.open($localize`Error al crear el perfil`, undefined, { duration: 2500 });
        return of(err);
      })
    ).subscribe();
  }

  submitBrandProfile() {
    if (this.brandForm.invalid) return;

    const formValue = this.brandForm.getRawValue();
    const request: BrandProfileRequestDTO = {
      companyName: formValue.companyName,
      description: formValue.description,
      industry: formValue.industry,
      websiteUrl: formValue.websiteUrl,
      logoUrl: formValue.logoUrl
    };

    this.facade.createBrandProfile(request).pipe(
      tap(() => {
        this.snack.open($localize`Perfil creado exitosamente`, undefined, { duration: 2500 });
        this.router.navigate(['/dashboard']);
      }),
      catchError(err => {
        this.snack.open($localize`Error al crear el perfil`, undefined, { duration: 2500 });
        return of(err);
      })
    ).subscribe();
  }
}
