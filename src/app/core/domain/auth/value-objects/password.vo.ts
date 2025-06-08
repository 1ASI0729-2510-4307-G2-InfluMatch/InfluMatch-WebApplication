export class Password {
    private constructor(public readonly value: string) {}
  
    static create(value: string): Password {
      // 8+ chars, 1 upper, 1 lower, 1 number, 1 special
      const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strong.test(value)) {
        throw new Error('INVALID_PASSWORD');
      }
      return new Password(value);
    }
  }