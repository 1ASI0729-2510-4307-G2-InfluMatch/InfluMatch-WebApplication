export interface User {
  id: string;
  email: string;
  name?: string;
  profile_completed: boolean;
  avatar_url?: string;
  user_type: string; // Now required
  token?: string; // Added for authentication
  // Otros campos que pueda tener el usuario
}
