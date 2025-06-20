import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRepository } from '../../domain/repositories/dashboard-repository';
import { DashboardProfileVO } from '../../domain/value-objects/dashboard-profile.vo';

@Injectable({
  providedIn: 'root'
})
export class ListBrandsUseCase {
  constructor(private repository: DashboardRepository) {}

  execute(): Observable<DashboardProfileVO[]> {
    return this.repository.getBrands();
  }
}
