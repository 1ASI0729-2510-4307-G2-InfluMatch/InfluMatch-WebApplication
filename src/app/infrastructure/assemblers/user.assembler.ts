import { User } from '../../domain/entities/user.entity';
import { NewUserVO } from '../../domain/value-objects/new-user.vo';
import { ProfileVO } from '../../domain/value-objects/profile.vo';
import { AuthResponseDTO } from '../../infrastructure/dtos/auth/auth-response.dto';

export interface LoginResponseDTO extends AuthResponseDTO {}

export interface RegisterResponseDTO {
  id: string;
  email: string;
  name: string;
  user_type: string;
  profile_completed: boolean;
}

export interface ProfileResponseDTO extends AuthResponseDTO {
  profile_completed: boolean;
}

export class UserAssembler {
  static toUser(dto: AuthResponseDTO): User {
    return {
      userId: dto.userId,
      email: dto.email,
      role: dto.role,
      token: dto.token,
      message: dto.message,
      profile_completed: false
    };
  }

  static toUserFromRegister(dto: AuthResponseDTO): User {
    return this.toUser(dto);
  }

  static toUserFromProfile(dto: ProfileResponseDTO): User {
    return {
      ...this.toUser(dto),
      profile_completed: true
    };
  }

  static toNewUserDTO(vo: NewUserVO): any {
    return {
      email: vo.email,
      password: vo.password,
      role: vo.user_type
    };
  }

  static toProfileDTO(vo: ProfileVO): any {
    return {
      ...vo
    };
  }
} 