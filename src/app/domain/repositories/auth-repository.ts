import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserCredentials } from '../value-objects/user-credentials.vo';
import { RegisterVO } from '../value-objects/auth/register.vo';
import { ProfileVO } from '../value-objects/profile.vo';

export abstract class AuthRepository {
  abstract login(creds: UserCredentials): Observable<User | null>;
  abstract register(data: RegisterVO): Observable<User>;
  abstract updateProfile(data: ProfileVO): Observable<User>;
}
