import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../../../infrastructure/services/profile.service';
import { BrandProfile, InfluencerProfile } from '../../../domain/models/profile.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileDetailsComponent implements OnInit {
  profile$!: Observable<BrandProfile | InfluencerProfile | null>;
  userType!: 'BRAND' | 'INFLUENCER';
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Get the current user type from local storage
    const storedType = localStorage.getItem('profileType');
    if (!storedType || (storedType !== 'BRAND' && storedType !== 'INFLUENCER')) {
      this.error = 'Invalid user type';
      this.navigateToDashboard();
      return;
    }
    this.userType = storedType;
    
    // Initialize the profile$ observable
    this.profile$ = this.route.params.pipe(
      switchMap(params => {
        const userId = +params['id'];
        if (!userId) {
          this.error = 'Invalid profile ID';
          return of(null);
        }

        return this.profileService.getProfileById(userId).pipe(
          catchError(err => {
            console.error('Error loading profile:', err);
            this.error = err.message || 'Failed to load profile details';
            return of(null);
          })
        );
      })
    );

    this.profile$.subscribe({
      next: (profile) => {
        this.loading = false;
        if (!profile) {
          this.error = 'Profile not found';
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile details';
        this.loading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  navigateToDashboard(): void {
    Promise.resolve().then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  isBrandProfile(profile: any): profile is BrandProfile {
    return profile && 'sector' in profile;
  }

  isInfluencerProfile(profile: any): profile is InfluencerProfile {
    return profile && 'niches' in profile;
  }

  hasValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
} 