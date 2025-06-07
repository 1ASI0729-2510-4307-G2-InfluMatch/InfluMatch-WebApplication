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
      id: dto.userId.toString(),
      email: dto.email,
      user_type: dto.role,
      token: dto.token,
      profile_completed: false // Un usuario recién registrado no tiene perfil completo
    };
  }
} 