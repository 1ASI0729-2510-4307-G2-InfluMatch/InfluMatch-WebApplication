export interface User {
  id: string;
  email: string;
  name?: string;
  profile_completed: boolean;
  avatar_url?: string;
  user_type?: string; // Este campo puede ser 'influencer' o 'brand'
  // Otros campos que pueda tener el usuario
}
