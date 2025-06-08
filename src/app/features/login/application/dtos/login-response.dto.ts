import { Role } from '@core/domain/auth/value-objects/role.vo';

export interface LoginResponseDTO {
  userId: number;
  email: string;
  role: string;
  token: string;
  hasProfile: boolean;
  message: string;
}
