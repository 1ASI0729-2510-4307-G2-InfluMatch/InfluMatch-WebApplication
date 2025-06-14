// src/app/domain/value-objects/new-user.vo.ts
export interface NewUserVO {
  email: string;
  password: string;
  role: 'BRAND' | 'INFLUENCER';
}
