import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../entities/brand.entity';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable({
  providedIn: 'root'
})
export class GetBrandsUseCase {
  constructor(private readonly repository: DashboardRepository) {}

  execute(): Observable<Brand[]> {
    return this.repository.getBrands();
  }
} 