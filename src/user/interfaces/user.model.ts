interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

type UserResponse = Omit<User, 'password'>;

export { User, UserResponse };
