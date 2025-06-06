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

import { AuthService } from '../../../../core/services/auth.service';
import { UpdateProfileUseCase } from '../../../../application/use-cases/update-profile.usecase';
import { ProfileVO } from '../../../../domain/value-objects/profile.vo';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  form!: FormGroup;
  user_type!: 'influencer' | 'marca';
  userId!: string;
  currentStep = 1;
  imagePreview: string | null = null;
  console = console; // Para poder usar console.log en el template

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
    private auth: AuthService,
    private updateProfile: UpdateProfileUseCase,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser!;
    this.user_type = user.user_type as any;
    this.userId = user.id;

    // Crear formulario base con campos comunes
    this.form = this.fb.group({
      display_name: [user.name, Validators.required],
      avatar_url: [user.avatar_url || ''],
      bio: ['', Validators.required],
      location: ['', Validators.required],
      contact_email: [user.email, [Validators.required, Validators.email]],
    });

    // Añadir campos específicos según el tipo de usuario
    if (this.user_type === 'influencer') {
      this.form.addControl('niche', this.fb.control('', Validators.required));
      this.form.addControl(
        'followers',
        this.fb.group({
          instagram: [0],
          tiktok: [0],
          youtube: [0],
        })
      );
      this.form.addControl(
        'rate_per_post',
        this.fb.control(0, Validators.required)
      );
      this.form.addControl('engagement_rate', this.fb.control(''));
      this.form.addControl('main_audience', this.fb.control(''));
      this.form.addControl('languages', this.fb.control([]));
      this.form.addControl(
        'social_links',
        this.fb.group({
          instagram: [''],
          tiktok: [''],
          youtube: [''],
          twitter: [''],
          facebook: [''],
        })
      );
      this.form.addControl('portfolio_urls', this.fb.array([]));
      this.form.addControl('previous_experience', this.fb.control(''));
      this.form.addControl('preferred_categories', this.fb.control([]));

      // Añadir una URL de portafolio por defecto
      this.addPortfolioUrl();
    } else {
      // Campos para marcas
      this.form.addControl('sector', this.fb.control('', Validators.required));
      this.form.addControl('website', this.fb.control(''));
      this.form.addControl(
        'budget_range',
        this.fb.control('', Validators.required)
      );
      this.form.addControl(
        'objectives',
        this.fb.control('', Validators.required)
      );
      this.form.addControl('contact_name', this.fb.control(''));
      this.form.addControl('contact_position', this.fb.control(''));
      this.form.addControl('content_s', this.fb.control([]));
      this.form.addControl('influencer_s', this.fb.control([]));
      this.form.addControl('campaign_duration', this.fb.control(''));
      this.form.addControl('additional_info', this.fb.control(''));
      this.form.addControl(
        'social_links',
        this.fb.group({
          instagram: [''],
          facebook: [''],
        })
      );
    }
  }

  // Getter para acceder fácilmente al FormArray de portfolio_urls
  get portfolioUrls() {
    return this.form.get('portfolio_urls') as FormArray;
  }

  // Método para añadir una nueva URL al portafolio
  addPortfolioUrl() {
    if (this.user_type === 'influencer') {
      this.portfolioUrls.push(this.fb.control(''));
    }
  }

  // Método para eliminar una URL del portafolio
  removePortfolioUrl(index: number) {
    this.portfolioUrls.removeAt(index);
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Validar tipo y tamaño
      if (!file.type.includes('image/')) {
        alert('Por favor, selecciona una imagen válida');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 2MB
        alert('La imagen no debe superar los 2MB');
        return;
      }

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        // En un caso real, aquí subirías la imagen al servidor
        // y guardarías la URL en el formulario
        this.form.patchValue({
          avatar_url: this.imagePreview,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para eliminar la imagen
  removeImage() {
    this.imagePreview = null;
    this.form.patchValue({
      avatar_url: '',
    });
  }

  // Navegación entre pasos
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  submit() {
    if (this.form.invalid) return;

    console.log('Form data:', this.form.value);

    const formData = this.form.value;
    const payload: ProfileVO = {
      user_id: this.userId,
      profile_completed: true,
      display_name: formData.display_name,
      avatar_url: formData.avatar_url,
      bio: formData.bio,
      location: formData.location,
      contact_email: formData.contact_email,
    };

    // Añadir campos específicos según el tipo de usuario
    if (this.user_type === 'influencer') {
      Object.assign(payload, {
        niche: formData.niche,
        followers: formData.followers,
        rate_per_post: formData.rate_per_post,
        engagement_rate: formData.engagement_rate,
        main_audience: formData.main_audience,
        languages: formData.languages,
        social_links: formData.social_links,
        portfolio_urls: formData.portfolio_urls,
        previous_experience: formData.previous_experience,
        preferred_categories: formData.preferred_categories,
      });
    } else {
      Object.assign(payload, {
        sector: formData.sector,
        website: formData.website,
        budget_range: formData.budget_range,
        objectives: formData.objectives,
        contact_name: formData.contact_name,
        contact_position: formData.contact_position,
        content_s: formData.content_s,
        influencer_s: formData.influencer_s,
        campaign_duration: formData.campaign_duration,
        additional_info: formData.additional_info,
        social_links: formData.social_links,
      });
    }

    this.updateProfile.execute(payload).subscribe((u) => {
      this.auth.save(u);
      this.router.navigateByUrl('/dashboard');
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
