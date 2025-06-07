export type UserRole = 'BRAND' | 'INFLUENCER';

export interface RegisterRequestDTO {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponseDTO {
  userId: number;
  email: string;
  role: UserRole;
  token: string;
  message: string;
} 