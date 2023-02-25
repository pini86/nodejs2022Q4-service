import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { RepositoryUsersStorage } from './store/repository.users.storage';

@Injectable()
export class UsersService {
  constructor(@Inject('UsersStore') private storage: RepositoryUsersStorage) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.storage.create(createUserDto);
    if (createdUser) {
      return this.dateToNumber(createdUser);
    } else return createdUser;
  }

  async findAll() {
    return this.storage.getAll();
  }

  async findOne(id: string) {
    return this.storage.getById(id);
  }

  async update(id: string, updateUserDto: UpdatePasswordDto) {
    const updatedUser = await this.storage.update(id, updateUserDto);
    if (updatedUser) {
      return this.dateToNumber(updatedUser);
    } else return updatedUser;
  }

  async remove(id: string) {
    return this.storage.remove(id);
  }

  private dateToNumber(user: UserEntity): UserEntity {
    user.createdAt = +user.createdAt;
    user.updatedAt = +user.updatedAt;
    return user;
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    const user = await this.storage.getByLogin(login);
    if (!user) return null;
    return user;
  }
}
