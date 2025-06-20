import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardProfileVO } from '../value-objects/dashboard-profile.vo';

@Injectable()
export abstract class DashboardRepository {
  /**
   * Returns the list of influencers visible in the dashboard for a brand user.
   */
  abstract getInfluencers(): Observable<DashboardProfileVO[]>;

  /**
   * Returns the list of brands visible in the dashboard for an influencer user.
   */
  abstract getBrands(): Observable<DashboardProfileVO[]>;
} 