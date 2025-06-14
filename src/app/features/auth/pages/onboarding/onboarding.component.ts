import {
  Component,
  OnInit,
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { AuthService } from '../../../../infrastructure/services/auth.service';
import { UpdateProfileUseCase } from '../../../../application/use-cases/update-profile.usecase';
import { ProfileVO } from '../../../../domain/value-objects/profile.vo';
import { ProfileApi } from '../../../../infrastructure/api/profile.api';
import { BrandProfileVO } from '../../../../domain/value-objects/brand-profile.vo';
import { User } from '../../../../domain/entities/user.entity';
import { InfluencerProfileVO } from '../../../../domain/value-objects/influencer-profile.vo';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;
  user_type: 'influencer' | 'marca' = 'marca'; // Default to marca
  userId!: number;
  currentStep = 1;
  imagePreview: string | null = null;
  console = console; // Para poder usar console.log en el template
  isBrand: boolean;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Dropdown states
  nicheDropdownOpen = false;
  sectorDropdownOpen = false;
  audienceDropdownOpen = false;
  languageDropdownOpen = false;
  budgetDropdownOpen = false;
  categoryDropdownOpen = false;
  influencerTypeDropdownOpen = false;
  durationDropdownOpen = false;

  // Options for dropdowns
  nicheOptions = [
    { value: 'moda', label: 'Moda' },
    { value: 'belleza', label: 'Belleza' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'viajes', label: 'Viajes' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'gastronomia', label: 'Gastronomía' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'otro', label: 'Otro' },
  ];

  sectorOptions = [
    { value: 'moda', label: 'Moda' },
    { value: 'belleza', label: 'Belleza' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'hogar', label: 'Hogar y Decoración' },
    { value: 'salud', label: 'Salud' },
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'otro', label: 'Otro' },
  ];

  audienceOptions = [
    { value: '18-24', label: '18-24 años' },
    { value: '25-34', label: '25-34 años' },
    { value: '35-44', label: '35-44 años' },
    { value: '45+', label: '45+ años' },
  ];

  languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Portugués' },
    { value: 'other', label: 'Otro' },
  ];

  budgetOptions = [
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-50000', label: '$10,000 - $50,000' },
    { value: '50000+', label: '$50,000+' },
  ];

  contentTypeOptions = [
    { value: 'posts', label: 'Posts' },
    { value: 'stories', label: 'Stories' },
    { value: 'reels', label: 'Reels/TikToks' },
    { value: 'video', label: 'Videos' },
    { value: 'blogs', label: 'Blog Posts' },
  ];

  categoryOptions = [
    { value: 'moda', label: 'Moda' },
    { value: 'belleza', label: 'Belleza' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'hogar', label: 'Hogar y Decoración' },
    { value: 'salud', label: 'Salud' },
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'otro', label: 'Otro' },
  ];

  influencerTypeOptions = [
    { value: 'micro', label: 'Micro influencers (10K-50K seguidores)' },
    { value: 'mid', label: 'Mid-tier (50K-500K seguidores)' },
    { value: 'macro', label: 'Macro influencers (500K-1M seguidores)' },
    { value: 'mega', label: 'Mega influencers (1M+ seguidores)' },
  ];

  durationOptions = [
    { value: 'one-time', label: 'Publicación única' },
    { value: 'short', label: 'Corta (1-2 semanas)' },
    { value: 'medium', label: 'Media (1 mes)' },
    { value: 'long', label: 'Larga (3+ meses)' },
    { value: 'ongoing', label: 'Colaboración continua' },
  ];

  constructor(
    private fb: FormBuilder,
    private profileApi: ProfileApi,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {
    this.isBrand = this.auth.currentUser?.profileType === 'BRAND';
    this.initForm();
  }

  ngOnInit(): void {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.auth.currentUser.profileCompleted) {
      this.router.navigate(['/dashboard']);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      logo: [''],
      profilePhoto: [''],
      websiteUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      sector: [''],
      niches: [[]],
      followers: [0, [Validators.required, Validators.min(0)]],
      socialLinks: this.fb.array([]),
      links: this.fb.array([]),
      attachments: this.fb.array([])
    });

    // Add initial social link
    this.addSocialLink();
  }

  get socialLinks() {
    return this.form.get('socialLinks') as FormArray;
  }

  get links() {
    return this.form.get('links') as FormArray;
  }

  get attachments() {
    return this.form.get('attachments') as FormArray;
  }

  addSocialLink(): void {
    const socialLink = this.fb.group({
      platform: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.socialLinks.push(socialLink);
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }

  addLink(): void {
    const link = this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.links.push(link);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  removeAttachment(index: number): void {
    this.attachments.removeAt(index);
  }

  onFileSelected(event: Event, type: 'logo' | 'photo' | 'profilePhoto'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data URL prefix
        this.form.patchValue({ [type]: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  onAttachmentSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data URL prefix
        const attachment = this.fb.group({
          title: [file.name, Validators.required],
          description: [''],
          mediaType: [this.getMediaType(file.type), Validators.required],
          data: [base64]
        });
        this.attachments.push(attachment);
      };
      reader.readAsDataURL(file);
    }
  }

  private getMediaType(fileType: string): 'PHOTO' | 'VIDEO' | 'DOCUMENT' {
    if (fileType.startsWith('image/')) return 'PHOTO';
    if (fileType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const profileData = this.form.value;

      if (this.isBrand) {
        const brandProfile = new BrandProfileVO(
          profileData.name,
          profileData.sector,
          profileData.country,
          profileData.description,
          profileData.logo || '',
          profileData.profilePhoto || '',
          profileData.websiteUrl,
          profileData.location,
          profileData.links || [],
          profileData.attachments || []
        );

        this.profileApi.createBrandProfile(brandProfile).subscribe({
          next: (response: any) => {
            this.loading = false;
            // Update user data with profile completion status
            const updatedUser = {
              ...this.auth.currentUser,
              profileCompleted: true
            };
            this.auth.updateUserData(updatedUser);
            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            this.loading = false;
            console.error('Error creating brand profile:', error);
            this.snack.open(
              this.translate.instant('ERRORS.PROFILE_CREATION'),
              'OK',
              { duration: 3000 }
            );
          }
        });
      } else {
        const influencerProfile = new InfluencerProfileVO(
          profileData.name,
          profileData.niches || [],
          profileData.description, // Using description as bio
          profileData.country,
          profileData.photo || '',
          profileData.profilePhoto || '',
          profileData.followers || 0,
          profileData.socialLinks || [],
          profileData.location,
          profileData.links || [],
          profileData.attachments || []
        );

        this.profileApi.createInfluencerProfile(influencerProfile).subscribe({
          next: (response: any) => {
            this.loading = false;
            // Update user data with profile completion status
            const updatedUser = {
              ...this.auth.currentUser,
              profileCompleted: true
            };
            this.auth.updateUserData(updatedUser);
            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            this.loading = false;
            console.error('Error creating influencer profile:', error);
            this.snack.open(
              this.translate.instant('ERRORS.PROFILE_CREATION'),
              'OK',
              { duration: 3000 }
            );
          }
        });
      }
    }
  }

  // Métodos para obtener nombres de opciones
  getNicheName(value: string): string {
    return (
      this.nicheOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getSectorName(value: string): string {
    return (
      this.sectorOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getAudienceName(value: string): string {
    return (
      this.audienceOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getLanguageName(value: string): string {
    return (
      this.languageOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getBudgetName(value: string): string {
    return (
      this.budgetOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getCategoryName(value: string): string {
    return (
      this.categoryOptions.find((option) => option.value === value)?.label || ''
    );
  }

  getInfluencerTypeName(value: string): string {
    return (
      this.influencerTypeOptions.find((option) => option.value === value)
        ?.label || ''
    );
  }

  getDurationName(value: string): string {
    return (
      this.durationOptions.find((option) => option.value === value)?.label || ''
    );
  }

  // Métodos para seleccionar opciones
  selectNiche(value: string): void {
    this.form.patchValue({ niche: value });
  }

  selectSector(value: string): void {
    this.form.patchValue({ sector: value });
  }

  selectAudience(value: string): void {
    this.form.patchValue({ main_audience: value });
  }

  selectLanguage(value: string): void {
    this.form.patchValue({ primary_language: value });
  }

  selectBudget(value: string): void {
    this.form.patchValue({ budget_range: value });
  }

  selectContentType(value: string): void {
    this.form.patchValue({ primary_content_type: value });
  }

  selectCategory(value: string): void {
    this.form.patchValue({ preferred_category: value });
  }

  selectInfluencerType(value: string): void {
    this.form.patchValue({ influencer_type: value });
  }

  selectDuration(value: string): void {
    this.form.patchValue({ campaign_duration: value });
  }

  addNiche(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const niches = this.form.get('niches')?.value || [];
      niches.push(value);
      this.form.patchValue({ niches });
    }
    event.chipInput!.clear();
  }

  removeNiche(niche: string): void {
    const niches = this.form.get('niches')?.value || [];
    const index = niches.indexOf(niche);
    if (index >= 0) {
      niches.splice(index, 1);
      this.form.patchValue({ niches });
    }
  }
}
