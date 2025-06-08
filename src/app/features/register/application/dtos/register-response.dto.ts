import { Role } from '../../../../core/domain/auth/value-objects/role.vo';

export interface RegisterResponseDTO {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}