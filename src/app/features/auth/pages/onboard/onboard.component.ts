import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterUseCase } from '../../../../application/use-cases/register.usecase';
import { BrandProfileVO } from '../../../../domain/value-objects/brand-profile.vo';
import { InfluencerProfileVO } from '../../../../domain/value-objects/influencer-profile.vo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class OnboardComponent implements OnInit {
  profileForm!: FormGroup;
  profileType: 'BRAND' | 'INFLUENCER' = 'BRAND';
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registerUC: RegisterUseCase,
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    const profileType = localStorage.getItem('profileType');
    if (profileType) {
      this.profileType = profileType as 'BRAND' | 'INFLUENCER';
      this.initializeForm();
    }
  }

  private initializeForm() {
    if (this.profileType === 'BRAND') {
      this.profileForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        location: ['', [Validators.required]],
        websiteUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
        sector: ['', [Validators.required]],
        country: ['CO', [Validators.required]],
        logo: [''],
        profilePhoto: [''],
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });
    } else {
      this.profileForm = this.fb.group({
        name: ['', [Validators.required]],
        bio: ['', [Validators.required]],
        location: ['', [Validators.required]],
        country: ['CO', [Validators.required]],
        photo: [''],
        profilePhoto: [''],
        followers: [0, [Validators.required, Validators.min(0)]],
        niches: this.fb.array([]),
        socialLinks: this.fb.array([]),
        links: this.fb.array([]),
        attachments: this.fb.array([])
      });
    }
  }

  // Getters para los FormArrays
  get niches() {
    return this.profileForm.get('niches') as FormArray;
  }

  get socialLinks() {
    return this.profileForm.get('socialLinks') as FormArray;
  }

  get links() {
    return this.profileForm.get('links') as FormArray;
  }

  get attachments() {
    return this.profileForm.get('attachments') as FormArray;
  }

  // Métodos para manejar arrays
  addNiche() {
    this.niches.push(this.fb.control('', Validators.required));
  }

  removeNiche(index: number) {
    this.niches.removeAt(index);
  }

  addSocialLink() {
    this.socialLinks.push(this.fb.group({
      platform: ['INSTAGRAM', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    }));
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  addLink() {
    this.links.push(this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    }));
  }

  removeLink(index: number) {
    this.links.removeAt(index);
  }

  addAttachment() {
    this.attachments.push(this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      mediaType: ['PHOTO', Validators.required],
      data: ['']
    }));
  }

  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  // Métodos para manejar archivos
  async onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await this.fileToBase64(file);
      this.profileForm.patchValue({ logo: base64 });
    }
  }

  async onProfilePhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await this.fileToBase64(file);
      this.profileForm.patchValue({ profilePhoto: base64 });
    }
  }

  async onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await this.fileToBase64(file);
      this.profileForm.patchValue({ photo: base64 });
    }
  }

  async onAttachmentChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await this.fileToBase64(file);
      const attachment = this.attachments.at(index);
      attachment.patchValue({ data: base64 });
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

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      const formData = this.profileForm.value;
      const token = localStorage.getItem('token');

      if (!token) {
        this.errorMessage = 'No authentication token found';
        this.loading = false;
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      if (this.profileType === 'BRAND') {
        const brandProfile = {
          name: formData.name,
          sector: formData.sector,
          country: formData.country,
          description: formData.description,
          logo: formData.logo,
          profilePhoto: formData.profilePhoto,
          websiteUrl: formData.websiteUrl,
          location: formData.location,
          links: formData.links,
          attachments: formData.attachments
        };

        this.http.post('http://localhost:8080/api/profiles/brand', brandProfile, { headers })
          .subscribe({
            next: (response) => {
              console.log('Brand profile created:', response);
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error creating brand profile:', error);
              this.errorMessage = error.error?.message || 'Error creating profile';
              this.loading = false;
            }
          });
      } else {
        const influencerProfile = {
          name: formData.name,
          niches: formData.niches,
          bio: formData.bio,
          country: formData.country,
          photo: formData.photo,
          profilePhoto: formData.profilePhoto,
          followers: formData.followers,
          socialLinks: formData.socialLinks,
          location: formData.location,
          links: formData.links,
          attachments: formData.attachments
        };

        this.http.post('http://localhost:8080/api/profiles/influencer', influencerProfile, { headers })
          .subscribe({
            next: (response) => {
              console.log('Influencer profile created:', response);
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error creating influencer profile:', error);
              this.errorMessage = error.error?.message || 'Error creating profile';
              this.loading = false;
            }
          });
      }
    }
  }
} 