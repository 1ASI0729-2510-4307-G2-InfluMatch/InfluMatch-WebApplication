export interface User {
  accessToken: string;
  refreshToken: string;
  profileCompleted: boolean;
  userId: number;
  name: string;
  photoUrl: string;
  email: string;
  user_type: 'influencer' | 'marca';
  profileType: 'BRAND' | 'INFLUENCER';
}
