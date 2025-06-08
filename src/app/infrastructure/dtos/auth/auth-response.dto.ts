export interface AuthResponseDTO {
  userId: number;
  email: string;
  role: 'INFLUENCER' | 'BRAND';
  token: string;
  message: string;
} 