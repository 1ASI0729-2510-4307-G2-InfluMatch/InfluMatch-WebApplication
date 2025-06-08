import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@core/services/auth.service';
import { DashboardFacade } from '../application/facades/dashboard.facade';
import { Brand } from '@core/domain/dashboard/entities/brand.entity';
import { Influencer } from '@core/domain/dashboard/entities/influencer.entity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatToolbarModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  brands: Brand[] = [];
  influencers: Influencer[] = [];
  userRole: string = '';
  defaultImageUrl = 'assets/images/default-placeholder.png';
  failedImages: Set<string> = new Set();

  constructor(
    private readonly authService: AuthService,
    private readonly facade: DashboardFacade
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    
    if (this.userRole === 'influencer') {
      this.loadBrands();
    } else if (this.userRole === 'brand') {
      this.loadInfluencers();
    }
  }

  handleImageError(event: any, url: string) {
    // Solo si la imagen falla, la agregamos al set de imágenes fallidas
    this.failedImages.add(url);
    event.target.src = this.defaultImageUrl;
  }

  shouldShowDefaultImage(url: string): boolean {
    return this.failedImages.has(url);
  }

  private loadBrands() {
    this.facade.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }

  private loadInfluencers() {
    this.facade.getInfluencers().subscribe({
      next: (influencers) => {
        this.influencers = influencers;
      },
      error: (error) => {
        console.error('Error loading influencers:', error);
      }
    });
  }
} 