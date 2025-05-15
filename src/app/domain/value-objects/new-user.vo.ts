// src/app/domain/value-objects/new-user.vo.ts
export interface NewUserVO {
  name: string;
  email: string;
  password: string;
  user_type: string;
  profile_completed: boolean;
}
