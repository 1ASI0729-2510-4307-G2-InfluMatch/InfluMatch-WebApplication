import { RegisterVO } from '../../../domain/value-objects/auth/register.vo';
import { RegisterRequestDTO, RegisterResponseDTO } from '../../dtos/auth/register.dto';
import { User } from '../../../domain/entities/user.entity';

export class RegisterAssembler {
  static toRequestDTO(vo: RegisterVO): RegisterRequestDTO {
    return {
      email: vo.email,
      password: vo.password,
      role: vo.role
    };
  }

  static toUser(dto: RegisterResponseDTO): User {
    return {
      userId: dto.userId,
      email: dto.email,
      role: dto.role,
      token: dto.token,
      message: dto.message,
      profile_completed: false
    };
  }
} 