import { Observable } from 'rxjs';
import { UserProfileDetailVO } from '../value-objects/user-profile-detail.vo';

export abstract class UserProfileRepository {
  abstract getUserProfile(): Observable<UserProfileDetailVO>;
} 