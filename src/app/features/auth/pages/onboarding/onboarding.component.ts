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
  logoPreview: string | null = null;
  photoPreview: string | null = null;
  profilePhotoPreview: string | null = null;
  console = console; // Para poder usar console.log en el template
  isBrand: boolean;
  isSubmitting: boolean = false;
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
    if (this.isBrand) {
      this.form = this.fb.group({
        name: ['', Validators.required],
        sector: ['', Validators.required],
        country: ['', Validators.required],
        description: ['', Validators.required],
        logo: ['', Validators.required],
        profilePhoto: ['', Validators.required],
        websiteUrl: ['', Validators.required],
        location: ['', Validators.required],
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        niches: this.fb.array([], [Validators.required, Validators.minLength(1)]),
        bio: ['', Validators.required],
        country: ['', Validators.required],
        photo: ['', Validators.required],
        profilePhoto: ['', Validators.required],
        followers: [0, [Validators.required, Validators.min(0)]],
        socialLinks: this.fb.array([]),
        location: ['', Validators.required],
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });
      // Add initial social link only for influencer profiles
      this.addSocialLink();
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

  removeImage(type: 'logo' | 'photo' | 'profilePhoto'): void {
    this.form.patchValue({ [type]: '' });
    switch (type) {
      case 'logo':
        this.logoPreview = null;
        break;
      case 'photo':
        this.photoPreview = null;
        break;
      case 'profilePhoto':
        this.profilePhotoPreview = null;
        break;
    }
  }

  addAttachment(): void {
    const attachment = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mediaType: ['DOCUMENT', Validators.required],
      data: [''],
      preview: ['']
    });
    this.attachments.push(attachment);
  }

  onFileSelected(event: Event, type: 'logo' | 'photo' | 'profilePhoto'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snack.open(
          this.translate.instant('ERRORS.INVALID_FILE_TYPE'),
          'OK',
          { duration: 3000 }
        );
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.snack.open(
          this.translate.instant('ERRORS.FILE_TOO_LARGE'),
          'OK',
          { duration: 3000 }
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data URL prefix
        this.form.patchValue({ [type]: base64 });
        
        // Set preview based on type
        switch (type) {
          case 'logo':
            this.logoPreview = reader.result as string;
            break;
          case 'photo':
            this.photoPreview = reader.result as string;
            break;
          case 'profilePhoto':
            this.profilePhotoPreview = reader.result as string;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onAttachmentSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.snack.open(
          this.translate.instant('ERRORS.FILE_TOO_LARGE'),
          'OK',
          { duration: 3000 }
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data URL prefix
        const mediaType = this.getMediaType(file.type);
        
        // Si ya existe un attachment con el mismo título, actualizarlo
        const existingAttachment = this.attachments.controls.find(
          control => control.get('title')?.value === file.name
        );

        if (existingAttachment) {
          existingAttachment.patchValue({
            data: base64,
            preview: reader.result as string,
            mediaType: mediaType
          });
        } else {
          const attachment = this.fb.group({
            title: [file.name, Validators.required],
            description: [''],
            mediaType: [mediaType, Validators.required],
            data: [base64],
            preview: [reader.result as string]
          });
          this.attachments.push(attachment);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private getMediaType(fileType: string): 'PHOTO' | 'VIDEO' | 'DOCUMENT' {
    if (fileType.startsWith('image/')) return 'PHOTO';
    if (fileType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;
    try {
      // Debug: Imprimir el estado completo del formulario
      console.log('Submitting form...');
      console.log('Form State:', this.form.value);
      console.log('Form Valid:', this.form.valid);
      console.log('Form Errors:', this.form.errors);

      const formValue = this.form.value;

      if (this.isBrand) {
        const brandProfile = new BrandProfileVO(
          formValue.name,
          formValue.sector,
          formValue.country,
          formValue.description,
          formValue.logo,
          formValue.profilePhoto,
          formValue.websiteUrl,
          formValue.location,
          formValue.links || [],
          formValue.attachments || []
        );

        console.log('Creating brand profile:', brandProfile);

        await this.profileApi.createBrandProfile(brandProfile);
      } else {
        const influencerProfile = new InfluencerProfileVO(
          formValue.name,
          formValue.niches || [],
          formValue.bio,
          formValue.country,
          formValue.photo,
          formValue.profilePhoto,
          formValue.followers || 0,
          formValue.socialLinks || [],
          formValue.location,
          formValue.links || [],
          formValue.attachments || []
        );

        console.log('Creating influencer profile:', influencerProfile);

        await this.profileApi.createInfluencerProfile(influencerProfile);
      }

      // Update user data with profile completion status
      const updatedUser = {
        ...this.auth.currentUser,
        profileCompleted: true
      };
      await this.auth.updateUserData(updatedUser);
      this.snack.open(
        this.translate.instant('onboarding.success'),
        'OK',
        { duration: 3000 }
      );
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error in submit:', error);
      this.loading = false;
      this.snack.open(
        this.translate.instant('onboarding.error'),
        'OK',
        { duration: 5000 }
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private getMissingFields(): string[] {
    if (!this.form) return [];

    const missingFields: string[] = [];
    
    if (this.isBrand) {
      const brandFields = {
        name: 'Nombre',
        sector: 'Sector',
        country: 'País',
        description: 'Descripción',
        logo: 'Logo',
        profilePhoto: 'Foto de perfil',
        websiteUrl: 'Sitio web',
        location: 'Ubicación'
      };

      Object.entries(brandFields).forEach(([field, label]) => {
        const value = this.form.get(field)?.value;
        if (!value || value === '') {
          missingFields.push(label);
        }
      });
    } else {
      const influencerFields = {
        name: 'Nombre',
        bio: 'Biografía',
        country: 'País',
        photo: 'Foto',
        profilePhoto: 'Foto de perfil',
        followers: 'Seguidores',
        location: 'Ubicación'
      };

      Object.entries(influencerFields).forEach(([field, label]) => {
        const value = this.form.get(field)?.value;
        if (!value || value === '') {
          missingFields.push(label);
        }
      });

      // Verificar nichos
      const nichesArray = this.form.get('niches') as FormArray;
      if (!nichesArray.length) {
        missingFields.push('Nichos');
      }
    }

    console.log('Missing Fields:', missingFields);
    return missingFields;
  }

  get isFormValid(): boolean {
    if (!this.form) return false;

    // Debug: Imprimir el estado del formulario
    console.log('Form State:', this.form.value);
    console.log('Form Valid:', this.form.valid);
    console.log('Form Errors:', this.form.errors);

    if (this.isBrand) {
      // Validación para marca
      const requiredFields = ['name', 'sector', 'country', 'description', 'logo', 'profilePhoto', 'websiteUrl', 'location'];
      return requiredFields.every(field => {
        const value = this.form.get(field)?.value;
        const isValid = value !== null && value !== undefined && value !== '';
        console.log(`Field ${field}:`, { value, isValid });
        return isValid;
      });
    } else {
      // Validación para influencer
      const requiredFields = ['name', 'bio', 'country', 'photo', 'profilePhoto', 'followers', 'location'];
      const nichesArray = this.form.get('niches') as FormArray;
      const hasNiches = nichesArray.length > 0;
      
      const allFieldsValid = requiredFields.every(field => {
        const value = this.form.get(field)?.value;
        const isValid = value !== null && value !== undefined && value !== '';
        console.log(`Field ${field}:`, { value, isValid });
        return isValid;
      });

      console.log('Niches validation:', { hasNiches, nichesArray: nichesArray.value });
      
      return allFieldsValid && hasNiches;
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
