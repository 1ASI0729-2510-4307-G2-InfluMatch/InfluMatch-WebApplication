export interface User {
  userId: number;
  email: string;
  role: 'INFLUENCER' | 'BRAND';
  token: string;
  message: string;
  profile_completed?: boolean;
}
