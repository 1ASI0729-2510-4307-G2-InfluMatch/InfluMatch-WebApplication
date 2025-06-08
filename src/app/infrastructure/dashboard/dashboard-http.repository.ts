import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardRepository } from '@core/domain/dashboard/repositories/dashboard.repository';
import { Brand } from '@core/domain/dashboard/entities/brand.entity';
import { Influencer } from '@core/domain/dashboard/entities/influencer.entity';
import { BrandResponseDTO } from '@features/dashboard/application/dtos/brand-response.dto';
import { InfluencerResponseDTO } from '@features/dashboard/application/dtos/influencer-response.dto';
import { BrandAssembler } from '@features/dashboard/application/assemblers/brand.assembler';
import { InfluencerAssembler } from '@features/dashboard/application/assemblers/influencer.assembler';

@Injectable({
  providedIn: 'root'
})
export class DashboardHttpRepository extends DashboardRepository {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getBrands(): Observable<Brand[]> {
    return this.http
      .get<BrandResponseDTO[]>(`${this.apiUrl}/brands`)
      .pipe(map(dtos => BrandAssembler.toEntityList(dtos)));
  }

  getInfluencers(): Observable<Influencer[]> {
    return this.http
      .get<InfluencerResponseDTO[]>(`${this.apiUrl}/influencers`)
      .pipe(map(dtos => InfluencerAssembler.toEntityList(dtos)));
  }
} 