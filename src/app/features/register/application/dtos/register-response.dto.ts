export interface RegisterResponseDTO {
  userId: number;
  email: string;
  role: string;
  token: string;
  hasProfile: boolean;
  message: string;
}