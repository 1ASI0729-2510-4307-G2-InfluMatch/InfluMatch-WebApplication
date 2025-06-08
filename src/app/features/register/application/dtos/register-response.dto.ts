import { Role } from '../../../../core/domain/auth/value-objects/role.vo';

export interface RegisterResponseDTO {
  userId: number;
  email: string;
  role: string;
  token: string;
  hasProfile: boolean;
  message: string;
}