import { Observable } from 'rxjs';
import { Brand } from '../entities/brand.entity';
import { Influencer } from '../entities/influencer.entity';

export abstract class DashboardRepository {
  abstract getBrands(): Observable<Brand[]>;
  abstract getInfluencers(): Observable<Influencer[]>;
} 