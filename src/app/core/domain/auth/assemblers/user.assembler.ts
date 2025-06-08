import { Email } from '../value-objects/email.vo';
import { Role } from '../value-objects/role.vo';
import { User } from '../entities/user.entity';
import { RegisterResponseDTO } from '@features/register/application/dtos/register-response.dto';

export class UserAssembler {
  static fromResponse(dto: RegisterResponseDTO): User {
    return new User(
      dto.id,
      Email.create(dto.email),
      dto.role as Role,
      new Date(dto.createdAt),
    );
  }
}