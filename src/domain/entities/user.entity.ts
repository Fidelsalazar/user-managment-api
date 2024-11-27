export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(username: string, email: string, password: string): User {
    return new User(
      undefined,
      email,
      password,
      username,
      new Date(),
      new Date()
    );
  }
}

