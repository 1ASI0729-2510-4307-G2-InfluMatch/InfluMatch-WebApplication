import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardRepository } from '../../domain/repositories/dashboard-repository';
import { DashboardProfileVO } from '../../domain/value-objects/dashboard-profile.vo';
import { environment } from '../../../environments/environment';
import { DashboardAssembler } from '../assemblers/dashboard.assembler';

@Injectable({
  providedIn: 'root'
})
export class DashboardRepositoryImpl extends DashboardRepository {
  private readonly baseUrl = environment.apiBase;
  private readonly assembler = new DashboardAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getInfluencers(): Observable<DashboardProfileVO[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/dashboard/influencers`)
      .pipe(map(data => data.map(item => this.assembler.toValueObject(item))));
  }

  getBrands(): Observable<DashboardProfileVO[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/dashboard/brands`)
      .pipe(map(data => data.map(item => this.assembler.toValueObject(item))));
  }
} 