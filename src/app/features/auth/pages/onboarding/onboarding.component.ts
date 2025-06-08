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
import { AuthResponseDTO } from '../../../../infrastructure/dtos/auth/auth-response.dto';
import { CreateInfluencerProfileUseCase } from '../../../../application/use-cases/create-influencer-profile.usecase';
import { CreateBrandProfileUseCase } from '../../../../application/use-cases/create-brand-profile.usecase';
import { InfluencerProfileVO } from '../../../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../../../domain/value-objects/brand-profile.vo';

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
  currentStep = 1;
  imagePreview: string | null = null;
  authData: AuthResponseDTO;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private createInfluencerProfile: CreateInfluencerProfileUseCase,
    private createBrandProfile: CreateBrandProfileUseCase
  ) {
    // Recuperar datos de autenticación del localStorage
    const authDataStr = localStorage.getItem('authData');
    if (!authDataStr) {
      this.router.navigate(['/auth/login']);
      throw new Error('No auth data found');
    }
    this.authData = JSON.parse(authDataStr);
    
    // Inicializar el formulario inmediatamente en el constructor
    this.initForm();
  }

  ngOnInit() {
    // Si ya tiene perfil, redirigir al dashboard
    if (localStorage.getItem('hasProfile')) {
      this.router.navigate(['/dashboard']);
    }
  }

  private initForm() {
    if (this.authData.role === 'INFLUENCER') {
      this.form = this.fb.group({
        displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        bio: ['', [Validators.required, Validators.maxLength(255)]],
        category: ['', [Validators.maxLength(50)]],
        country: ['', [Validators.maxLength(50)]],
        followersCount: [null, [Validators.min(0)]],
        socialLinks: this.fb.array([this.createSocialLinkFormGroup()]),
        mediaAssets: this.fb.array([this.createMediaAssetFormGroup()])
      });
    } else {
      this.form = this.fb.group({
        companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        description: ['', [Validators.maxLength(255)]],
        industry: ['', [Validators.maxLength(50)]],
        websiteUrl: ['', [Validators.pattern('https?://.+')]],
        logoUrl: ['', [Validators.pattern('https?://.+')]]
      });
    }
  }

  private createSocialLinkFormGroup(): FormGroup {
    return this.fb.group({
      platform: ['IG', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  private createMediaAssetFormGroup(): FormGroup {
    return this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      mediaType: ['IMAGE', Validators.required],
      title: [''],
      description: [''],
      sizeBytes: [null],
      metadata: ['{}']
    });
  }

  addSocialLink() {
    const socialLinks = this.form.get('socialLinks') as FormArray;
    socialLinks.push(this.createSocialLinkFormGroup());
  }

  removeSocialLink(index: number) {
    const socialLinks = this.form.get('socialLinks') as FormArray;
    socialLinks.removeAt(index);
  }

  addMediaAsset() {
    const mediaAssets = this.form.get('mediaAssets') as FormArray;
    mediaAssets.push(this.createMediaAssetFormGroup());
  }

  removeMediaAsset(index: number) {
    const mediaAssets = this.form.get('mediaAssets') as FormArray;
    mediaAssets.removeAt(index);
  }

  get socialLinks() {
    return this.form.get('socialLinks') as FormArray;
  }

  get mediaAssets() {
    return this.form.get('mediaAssets') as FormArray;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Aquí implementarías la lógica para subir la imagen
      // Por ahora solo mostraremos la preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        // Aquí guardarías la URL de la imagen en el form
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    // Limpiar el campo del formulario
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      if (this.authData.role === 'INFLUENCER') {
        const formValue = this.form.value;
        const profileData: InfluencerProfileVO = {
          displayName: formValue.displayName,
          bio: formValue.bio,
          category: formValue.category,
          country: formValue.country,
          followersCount: formValue.followersCount,
          socialLinks: formValue.socialLinks.filter((link: any) => link.platform && link.url),
          mediaAssets: formValue.mediaAssets.filter((asset: any) => asset.url && asset.mediaType)
        };

        this.createInfluencerProfile.execute(profileData).subscribe({
          next: (response) => {
            localStorage.setItem('hasProfile', 'true');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error creating influencer profile:', error);
            // Mostrar mensaje de error
          }
        });
      } else {
        const profileData: BrandProfileVO = {
          companyName: this.form.get('companyName')?.value,
          description: this.form.get('description')?.value,
          industry: this.form.get('industry')?.value,
          websiteUrl: this.form.get('websiteUrl')?.value,
          logoUrl: this.form.get('logoUrl')?.value
        };

        this.createBrandProfile.execute(profileData).subscribe({
          next: (response) => {
            localStorage.setItem('hasProfile', 'true');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error creating brand profile:', error);
            // Mostrar mensaje de error
          }
        });
      }
    } catch (error) {
      console.error('Error in profile creation:', error);
      // Mostrar mensaje de error
    }
  }
}
