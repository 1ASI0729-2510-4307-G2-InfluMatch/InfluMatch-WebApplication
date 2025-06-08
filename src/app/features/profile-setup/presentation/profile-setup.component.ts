import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { MaterialModule } from '@shared/material/material.module';
import { ProfileSetupFacade } from '../application/facades/profile-setup.facade';
import { InfluencerProfileRequestDTO } from '../application/dtos/influencer-profile-request.dto';
import { BrandProfileRequestDTO } from '../application/dtos/brand-profile-request.dto';
import { LanguageSelectorComponent } from '@shared/language/language-selector.component';
import { TranslatePipe } from '@shared/translation/translate.pipe';

// Interfaces for form values
interface SocialLink {
  platform: string;
  url: string;
}

interface MediaAsset {
  url: string;
  mediaType: string;
  title?: string;
  description?: string;
  sizeBytes?: number;
  metadata?: string;
}

interface InfluencerFormValue {
  displayName: string;
  bio: string;
  category: string;
  country: string;
  followersCount: number;
  socialLinks: SocialLink[];
  mediaAssets: MediaAsset[];
}

// Enums for form options
enum SocialPlatform {
  IG = 'IG',
  YT = 'YT',
  TT = 'TT',
  FB = 'FB',
  TW = 'TW',
  LN = 'LN',
  OTHER = 'OTHER'
}

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOC = 'DOC'
}

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
  styleUrls: ['./profile-setup.component.scss'],
  providers: [TranslatePipe]
})
export class ProfileSetupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ProfileSetupFacade);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly translatePipe = inject(TranslatePipe);

  readonly SocialPlatform = SocialPlatform;
  readonly MediaType = MediaType;
  
  currentStep = 1;
  totalSteps = 5; // Updated to include all steps: Basic Info, Details, Followers, Social Links, Media Assets
  userRole: string = '';
  
  influencerForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    bio: ['', [Validators.required, Validators.maxLength(255)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    country: ['', [Validators.required, Validators.maxLength(50)]],
    followersCount: [0, [Validators.required, Validators.min(0)]],
    socialLinks: this.fb.array<FormGroup>([]),
    mediaAssets: this.fb.array<FormGroup>([])
  });

  brandForm = this.fb.group({
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

  // Helper getters for form arrays
  get socialLinks() {
    return this.influencerForm.get('socialLinks') as FormArray;
  }

  get mediaAssets() {
    return this.influencerForm.get('mediaAssets') as FormArray;
  }

  // Methods to create form groups for dynamic fields
  createSocialLinkFormGroup(): FormGroup {
    return this.fb.group({
      platform: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.*')]]
    });
  }

  createMediaAssetFormGroup(): FormGroup {
    return this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.*')]],
      mediaType: ['', Validators.required],
      title: [''],
      description: [''],
      sizeBytes: [null],
      metadata: ['{}']
    });
  }

  // Methods to add/remove dynamic fields
  addSocialLink() {
    this.socialLinks.push(this.createSocialLinkFormGroup());
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  addMediaAsset() {
    this.mediaAssets.push(this.createMediaAssetFormGroup());
  }

  removeMediaAsset(index: number) {
    this.mediaAssets.removeAt(index);
  }

  submitInfluencerProfile() {
    if (this.influencerForm.invalid) return;

    const formValue = this.influencerForm.getRawValue() as InfluencerFormValue;
    const request: InfluencerProfileRequestDTO = {
      displayName: formValue.displayName,
      bio: formValue.bio,
      category: formValue.category,
      country: formValue.country,
      followersCount: formValue.followersCount,
      socialLinks: formValue.socialLinks,
      mediaAssets: formValue.mediaAssets.map(asset => ({
        ...asset,
        metadata: asset.metadata ? JSON.parse(asset.metadata) : {}
      }))
    };

    this.facade.createInfluencerProfile(request).pipe(
      tap(() => {
        this.snack.open(
          this.translatePipe.transform('profile.setup.success'),
          this.translatePipe.transform('common.ok'),
          { duration: 3000 }
        );
        this.router.navigate(['/dashboard']);
      }),
      catchError(err => {
        this.snack.open(
          this.translatePipe.transform('profile.setup.error'),
          this.translatePipe.transform('common.ok'),
          { duration: 3000 }
        );
        return of(err);
      })
    ).subscribe();
  }

  submitBrandProfile() {
    if (this.brandForm.invalid) return;

    const formValue = this.brandForm.getRawValue();
    const request: BrandProfileRequestDTO = {
      companyName: formValue.companyName || '',
      description: formValue.description || '',
      industry: formValue.industry || '',
      websiteUrl: formValue.websiteUrl || '',
      logoUrl: formValue.logoUrl || ''
    };

    this.facade.createBrandProfile(request).pipe(
      tap(() => {
        this.snack.open(
          this.translatePipe.transform('profile.setup.success'),
          this.translatePipe.transform('common.ok'),
          { duration: 3000 }
        );
        this.router.navigate(['/dashboard']);
      }),
      catchError(err => {
        this.snack.open(
          this.translatePipe.transform('profile.setup.error'),
          this.translatePipe.transform('common.ok'),
          { duration: 3000 }
        );
        return of(err);
      })
    ).subscribe();
  }
}
