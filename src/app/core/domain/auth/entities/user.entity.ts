import { Role } from '../value-objects/role.vo';

export class User {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly role: Role,
    public readonly createdAt: Date
  ) {}
}