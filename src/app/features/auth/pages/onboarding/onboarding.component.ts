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
  currentLang = 'es';
  logoPreview: string | null = null;
  photoPreview: string | null = null;
  profilePhotoPreview: string | null = null;
  console = console; // Para poder usar console.log en el template
  isBrand: boolean;
  isSubmitting = false;
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

  steps = [
    'ONBOARDING.STEPS.BASIC',
    'ONBOARDING.STEPS.LOCATION',
    'ONBOARDING.STEPS.PROFILE'
  ];

  // Options for dropdowns
  nicheOptions = [
    { value: 'Moda', label: 'ONBOARDING.NICHES.FASHION' },
    { value: 'Lifestyle', label: 'ONBOARDING.NICHES.LIFESTYLE' },
    { value: 'Viajes', label: 'ONBOARDING.NICHES.TRAVEL' },
    { value: 'Belleza', label: 'ONBOARDING.NICHES.BEAUTY' },
    { value: 'Fitness', label: 'ONBOARDING.NICHES.FITNESS' },
    { value: 'Comida', label: 'ONBOARDING.NICHES.FOOD' },
    { value: 'Tecnología', label: 'ONBOARDING.NICHES.TECH' },
    { value: 'Gaming', label: 'ONBOARDING.NICHES.GAMING' },
    { value: 'Música', label: 'ONBOARDING.NICHES.MUSIC' },
    { value: 'Deportes', label: 'ONBOARDING.NICHES.SPORTS' }
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
    this.currentLang = this.translate.currentLang || 'es';
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
        description: ['', Validators.required],
        country: ['', Validators.required],
        location: ['', Validators.required],
        sector: ['', Validators.required],
        websiteUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        logo: [''],
        profilePhoto: [''],
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        country: ['', Validators.required],
        location: ['', Validators.required],
        niches: [[], Validators.required],
        followers: [0, [Validators.required, Validators.min(0)]],
        photo: [''],
        profilePhoto: [''],
        socialLinks: this.fb.array([]),
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });

      this.addSocialLink();
    }

    this.addLink();
    this.addAttachment();
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

  addAttachment(): void {
    const attachment = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mediaType: ['PHOTO', Validators.required],
      data: [''],
      preview: ['']
    });
    this.attachments.push(attachment);
  }

  removeAttachment(index: number): void {
    this.attachments.removeAt(index);
  }

  onFileSelected(event: Event, type: 'logo' | 'photo' | 'profilePhoto'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.snack.open(
          this.translate.instant('ERRORS.INVALID_FILE_TYPE'),
          'OK',
          { duration: 3000 }
        );
        return;
      }

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
        const base64 = (reader.result as string).split(',')[1];
        this.form.patchValue({ [type]: base64 });
        
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

  onAttachmentSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
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
        const base64 = (reader.result as string).split(',')[1];
        const mediaType = this.getMediaType(file.type);
        
        const attachment = this.attachments.at(index);
        attachment.patchValue({
          title: file.name,
          mediaType: mediaType,
          data: base64,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  private getMediaType(fileType: string): 'PHOTO' | 'VIDEO' | 'DOCUMENT' {
    if (fileType.startsWith('image/')) return 'PHOTO';
    if (fileType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  getAcceptType(index: number): string {
    const attachment = this.attachments.at(index);
    const mediaType = attachment.get('mediaType')?.value;
    switch (mediaType) {
      case 'PHOTO':
        return 'image/*';
      case 'VIDEO':
        return 'video/*';
      case 'DOCUMENT':
        return '.pdf,.doc,.docx';
      default:
        return '*/*';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;
    try {
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
          formValue.links.map((link: any) => ({
            title: link.title,
            url: link.url
          })),
          formValue.attachments.map((attachment: any) => ({
            title: attachment.title,
            description: attachment.description,
            mediaType: attachment.mediaType,
            data: attachment.data
          }))
        );

        await this.profileApi.createBrandProfile(brandProfile).toPromise();
      } else {
        const influencerProfile = new InfluencerProfileVO(
          formValue.name,
          formValue.niches,
          formValue.description,
          formValue.country,
          formValue.photo,
          formValue.profilePhoto,
          formValue.followers,
          formValue.socialLinks.map((link: any) => ({
            platform: link.platform,
            url: link.url
          })),
          formValue.location,
          formValue.links.map((link: any) => ({
            title: link.title,
            url: link.url
          })),
          formValue.attachments.map((attachment: any) => ({
            title: attachment.title,
            description: attachment.description,
            mediaType: attachment.mediaType,
            data: attachment.data
          }))
        );

        await this.profileApi.createInfluencerProfile(influencerProfile).toPromise();
      }

      const updatedUser = {
        ...this.auth.currentUser,
        profileCompleted: true
      };
      await this.auth.updateUserData(updatedUser);

      this.snack.open(
        this.translate.instant('ONBOARDING.SUCCESS'),
        'OK',
        { duration: 3000 }
      );
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error in submit:', error);
      this.snack.open(
        this.translate.instant('ONBOARDING.ERROR'),
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

  changeLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const stepControls = {
      1: ['name', 'description'],
      2: ['country', 'location'],
      3: this.isBrand ? ['sector', 'websiteUrl'] : ['niches', 'followers']
    };

    return stepControls[this.currentStep as keyof typeof stepControls].every(
      control => {
        const formControl = this.form.get(control);
        return formControl && formControl.valid;
      }
    );
  }
}