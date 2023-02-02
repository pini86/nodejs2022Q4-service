class UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

class UserEntity extends UserResponse {
  password: string;
}

export { UserResponse, UserEntity };
