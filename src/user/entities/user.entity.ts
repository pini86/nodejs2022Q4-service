class UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

class User extends UserResponse {
  password: string;
}

export { UserResponse, User };
