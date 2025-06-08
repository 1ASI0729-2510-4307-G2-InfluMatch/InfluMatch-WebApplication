import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ListInfluencersUseCase } from '../../../../application/use-cases/list-influencers.usecase';
import { ListBrandsUseCase } from '../../../../application/use-cases/list-brands.usecase';
import { InfluencerProfileVO } from '../../../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../../../domain/value-objects/brand-profile.vo';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  influencers: InfluencerProfileVO[] = [];
  brands: BrandProfileVO[] = [];
  role?: string;
  loading = true;
  error = false;

  constructor(
    private auth: AuthService,
    private listInf: ListInfluencersUseCase,
    private listBr: ListBrandsUseCase
  ) {}

  ngOnInit() {
    this.role = this.auth.getCurrentUser()?.role;

    if (this.role === 'BRAND') {
      this.listBr.execute().subscribe({
        next: (list) => {
          this.brands = list;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading brands:', err);
          this.error = true;
          this.loading = false;
        },
      });
    } else {
      this.listInf.execute().subscribe({
        next: (list) => {
          this.influencers = list;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading influencers:', err);
          this.error = true;
          this.loading = false;
        },
      });
    }
  }
}
