import { User } from '../../domain/entities/user.entity';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';

export interface LoginResponseDTO {
  userId: number;
  email: string;
  role: string;
  token: string;
  message: string;
}

export interface RegisterResponseDTO {
  id: string;
  email: string;
  name: string;
  user_type: string;
  profile_completed: boolean;
}

export interface ProfileResponseDTO {
  id: string;
  email: string;
  name: string;
  user_type: string;
  profile_completed: boolean;
  avatar_url?: string;
  // Otros campos del perfil según corresponda
}

export class UserAssembler {
  static toUser(dto: LoginResponseDTO): User {
    return {
      id: dto.userId.toString(),
      email: dto.email,
      user_type: dto.role,
      token: dto.token,
      profile_completed: true // Since we got a successful login, we assume the profile is complete
    };
  }

  static toUserFromRegister(dto: RegisterResponseDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      user_type: dto.user_type,
      profile_completed: dto.profile_completed
    };
  }

  static toUserFromProfile(dto: ProfileResponseDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      user_type: dto.user_type,
      profile_completed: dto.profile_completed,
      avatar_url: dto.avatar_url
    };
  }

  static toNewUserDTO(vo: NewUserVO): any {
    return {
      name: vo.name,
      email: vo.email,
      password: vo.password,
      user_type: vo.user_type,
      profile_completed: vo.profile_completed
    };
  }

  static toProfileDTO(vo: ProfileVO): any {
    return {
      ...vo
    };
  }
} 