import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GetUserDetailsUseCase } from '../../../../application/use-cases/get-user-details.usecase';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit {
  profileId: string | null = null;
  profileData: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getUserDetailsUseCase: GetUserDetailsUseCase
  ) {}

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id');

    if (this.profileId) {
      this.loadProfileData(this.profileId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadProfileData(id: string): void {
    this.loading = true;
    this.getUserDetailsUseCase.execute(id).subscribe({
      next: (data) => {
        this.profileData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile data:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getFollowersTotal(): number {
    if (!this.profileData?.followers) return 0;

    return Object.values(this.profileData.followers).reduce(
      (sum: number, val: any) => sum + (Number(val) || 0),
      0
    );
  }

  getSocialLinks(): { platform: string; url: string; icon: string }[] {
    if (!this.profileData?.social_links) return [];

    const links = [];
    const icons: { [key: string]: string } = {
      instagram: 'instagram',
      facebook: 'facebook',
      twitter: 'twitter',
      tiktok: 'tiktok',
      youtube: 'smart_display',
    };

    for (const [platform, url] of Object.entries(
      this.profileData.social_links
    )) {
      if (url) {
        links.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: url as string,
          icon: icons[platform] || 'link',
        });
      }
    }

    return links;
  }

  isInfluencer(): boolean {
    return this.profileData?.user_type === 'influencer';
  }
}
