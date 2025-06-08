import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBrandsUseCase } from '@core/domain/dashboard/use-cases/get-brands.usecase';
import { GetInfluencersUseCase } from '@core/domain/dashboard/use-cases/get-influencers.usecase';
import { Brand } from '@core/domain/dashboard/entities/brand.entity';
import { Influencer } from '@core/domain/dashboard/entities/influencer.entity';

@Injectable({
  providedIn: 'root'
})
export class DashboardFacade {
  constructor(
    private readonly getBrandsUseCase: GetBrandsUseCase,
    private readonly getInfluencersUseCase: GetInfluencersUseCase
  ) {}

  getBrands(): Observable<Brand[]> {
    return this.getBrandsUseCase.execute();
  }

  getInfluencers(): Observable<Influencer[]> {
    return this.getInfluencersUseCase.execute();
  }
} 