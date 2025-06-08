import { Role } from "@app/core/domain/auth/enums/role.enum";

export interface RegisterRequestDTO {
  email: string;
  password: string;
  role: Role;
}