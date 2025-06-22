// domain/entities/profile.entity.ts
export abstract class Profile {
  constructor(
    public readonly userId: string,
    public profileCompleted: boolean
  ) {}
}
