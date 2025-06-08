import { Role } from '@core/domain/auth/value-objects/role.vo';

export interface LoginResponseDTO {
  userId: string;
  email: string;
  role: Role;
  token: string;
  hasProfile: boolean;
  message: string;
}
