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
      user_type: 'marca', // Default value, will be updated during profile completion
      profileType: response.userId === 1 ? 'BRAND' : 'INFLUENCER'
    };
  }

  static toDomain(data: any): User {
    return {
      userId: data.userId,
      email: data.email,
      name: data.name,
      photoUrl: data.photoUrl,
      user_type: data.user_type,
      profileCompleted: data.profileCompleted,
      profileType: data.user_type === 'marca' ? 'BRAND' : 'INFLUENCER',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  }

  static toDTO(user: User): any {
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      user_type: user.user_type,
      profileCompleted: user.profileCompleted,
      profileType: user.profileType,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    };
  }
} 