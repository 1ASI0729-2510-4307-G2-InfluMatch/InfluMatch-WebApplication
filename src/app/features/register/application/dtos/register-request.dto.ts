import { Role } from '../../../../core/domain/auth/value-objects/role.vo';

export interface RegisterRequestDTO {
  email: string;
  password: string;
  role: Role;
}