import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserCredentials } from '../value-objects/user-credentials.vo';
import { NewUserVO } from '../value-objects/new-user.vo';
import { ProfileVO } from '../value-objects/profile.vo';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<any>;
  abstract register(email: string, password: string, role: string): Observable<any>;
  abstract logout(): Observable<any>;
  abstract updateProfile(data: ProfileVO): Observable<User>;
}
