import { Email } from '../value-objects/email.vo';
import { Role } from '../value-objects/role.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly role: Role,
    public readonly createdAt: Date,
  ) {}
}