import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardProfileVO } from '../../../../domain/value-objects/dashboard-profile.vo';
import { DashboardRepository } from '../../../../domain/repositories/dashboard-repository';
import { DashboardRepositoryImpl } from '../../../../infrastructure/repositories/dashboard.repository';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule,
    ProfileCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {
      provide: DashboardRepository,
      useClass: DashboardRepositoryImpl
    }
  ]
})
export class HomeComponent implements OnInit {
  profiles: DashboardProfileVO[] = [];
  loading = true;
  error = false;
  role: string = '';

  constructor(
    private dashboardRepository: DashboardRepository,
    private authService: AuthService
  ) {
    this.role = this.authService.getUserRole();
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  private loadProfiles(): void {
    const request = this.role === 'marca' 
      ? this.dashboardRepository.getInfluencers()
      : this.dashboardRepository.getBrands();

    request.subscribe({
      next: (data) => {
        this.profiles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
