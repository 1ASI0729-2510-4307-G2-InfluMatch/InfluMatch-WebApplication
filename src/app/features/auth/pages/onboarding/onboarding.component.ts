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
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  user_type: 'influencer' | 'marca' = 'marca'; // Default to marca
  userId!: number;
  currentStep = 1;
  imagePreview: string | null = null;
  console = console; // Para poder usar console.log en el template
  isBrand: boolean;

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
    this.form = this.initForm();
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

  private initForm(): FormGroup {
    const baseForm = {
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      country: ['', [Validators.required]],
      location: ['', [Validators.required]],
      socialLinks: this.fb.array([]),
      links: this.fb.array([]),
      attachments: this.fb.array([])
    };

    if (this.isBrand) {
      return this.fb.group({
        ...baseForm,
        sector: ['', [Validators.required]],
        websiteUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        logo: [''],
        profilePhoto: ['']
      });
    } else {
      return this.fb.group({
        ...baseForm,
        niches: ['', [Validators.required]],
        followers: [0, [Validators.required, Validators.min(0)]],
        photo: [''],
        profilePhoto: ['']
      });
    }
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

  addSocialLink() {
    const socialLink = this.fb.group({
      platform: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.socialLinks.push(socialLink);
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  addLink() {
    const link = this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.links.push(link);
  }

  removeLink(index: number) {
    this.links.removeAt(index);
  }

  async onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await this.fileToBase64(file);
        this.form.patchValue({ [field]: base64 });
      } catch (error) {
        this.snack.open(
          this.translate.instant('ERRORS.FILE_UPLOAD'),
          'OK',
          { duration: 3000 }
        );
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async onAttachmentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await this.fileToBase64(file);
        const attachment = this.fb.group({
          title: [file.name, Validators.required],
          description: [''],
          mediaType: [this.getMediaType(file.type), Validators.required],
          data: [base64, Validators.required]
        });
        this.attachments.push(attachment);
      } catch (error) {
        this.snack.open(
          this.translate.instant('ERRORS.FILE_UPLOAD'),
          'OK',
          { duration: 3000 }
        );
      }
    }
  }

  private getMediaType(mimeType: string): 'PHOTO' | 'VIDEO' | 'DOCUMENT' {
    if (mimeType.startsWith('image/')) return 'PHOTO';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const profileData = this.form.value;

    const request = this.isBrand
      ? this.profileApi.createBrandProfile(profileData as BrandProfileVO)
      : this.profileApi.createInfluencerProfile(profileData as InfluencerProfileVO);

    request.subscribe({
      next: () => {
        const updatedUser = {
          ...this.auth.currentUser,
          profileCompleted: true
        };
        this.auth.updateUserData(updatedUser);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.snack.open(
          this.translate.instant('ERRORS.PROFILE_CREATION'),
          'OK',
          { duration: 3000 }
        );
      }
    });
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
}
