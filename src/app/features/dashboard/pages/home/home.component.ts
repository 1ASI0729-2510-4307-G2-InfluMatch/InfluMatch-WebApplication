import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../../core/services/auth.service';
import { ListInfluencersUseCase } from '../../../../application/use-cases/list-influencers.usecase';
import { ListBrandsUseCase } from '../../../../application/use-cases/list-brands.usecase';
import { InfluencerProfileVO } from '../../../../domain/value-objects/influencer-profile.vo';
import { BrandProfileVO } from '../../../../domain/value-objects/brand-profile.vo';
import { User } from '../../../../domain/entities/user.entity';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';

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
})
export class HomeComponent implements OnInit {
  influencers: InfluencerProfileVO[] = [];
  brands: BrandProfileVO[] = [];
  role: 'influencer' | 'marca' = 'marca';
  user?: User;
  name = '';
  loading = true;
  error = false;

  constructor(
    private auth: AuthService,
    private listInf: ListInfluencersUseCase,
    private listBrands: ListBrandsUseCase
  ) {}

  ngOnInit() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.user = currentUser;
      this.name = currentUser.name;
      this.role = currentUser.user_type;

      if (this.role === 'marca') {
        this.listInf.execute().subscribe({
          next: (list) => {
            this.influencers = list;
            this.loading = false;
          },
          error: () => {
            this.error = true;
            this.loading = false;
          },
        });
      } else {
        this.listBrands.execute().subscribe({
          next: (list) => {
            this.brands = list;
            this.loading = false;
          },
          error: () => {
            this.error = true;
            this.loading = false;
          },
        });
      }
    }
  }
}
