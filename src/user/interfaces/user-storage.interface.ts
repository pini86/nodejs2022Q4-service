import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface UsersStore {
  getAll: () => Promise<UserEntity[]>;

  getById: (id: string) => Promise<UserEntity>;

  getByLogin: (login: string) => Promise<UserEntity | null>;

  update: (id: string, dto: UpdatePasswordDto) => Promise<UserEntity>;

  create: (dto: CreateUserDto) => Promise<UserEntity>;

  remove: (id: string) => Promise<boolean>;
}
