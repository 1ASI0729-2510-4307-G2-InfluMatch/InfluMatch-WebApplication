export type Role = 'BRAND' | 'INFLUENCER';

export class RoleVO {
  constructor(private readonly value: Role) {}

  getValue(): Role {
    return this.value;
  }

  static create(value: Role): RoleVO {
    return new RoleVO(value);
  }
}
