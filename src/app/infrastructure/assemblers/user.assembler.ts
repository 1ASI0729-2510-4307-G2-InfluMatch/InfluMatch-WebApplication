import { User } from '../../domain/entities/user.entity';

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  profileCompleted: boolean;
  userId: number;
}

export class UserAssembler {
  static toUser(response: RegisterResponse): User {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      profileCompleted: response.profileCompleted,
      userId: response.userId,
      name: '', // Will be set during profile completion
      photoUrl: '', // Will be set during profile completion
      email: '', // Will be set during profile completion
      user_type: 'marca' // Default value, will be updated during profile completion
    };
  }
} 