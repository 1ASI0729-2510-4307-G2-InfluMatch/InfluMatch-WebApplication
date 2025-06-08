import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';
import { User } from '../entities/user.entity';
import { Role } from '../value-objects/role.vo';

export class UserAssembler {
  static toEntity(dto: RegisterResponseDTO): User {
    return new User(
      dto.userId,
      dto.email,
      dto.role as Role,
      new Date()
    );
  }
}