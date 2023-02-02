import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataBaseInMemory } from '../db/exp.db';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as uuid from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private dataBase: DataBaseInMemory) {}

  getAll() {
    return this.dataBase.users;
  }

  getOne(id: string) {
    const user = this.dataBase.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userwopass } = user;
    return userwopass;
  }

  create(createUserDto: CreateUserDto) {
    if (
      this.dataBase.users.find((item) => item.login === createUserDto.login)
    ) {
      throw new ConflictException('User already exists');
    }
    const dateNow = Date.now();
    const newUser = Object.assign(new UserEntity(), {
      id: uuid.v4(),
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...createUserDto,
    });
    this.dataBase.users.push(newUser);
    const { password, ...userwopass } = newUser;
    return userwopass;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.dataBase.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Wrong password');
    }

    user.password = newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();

    const { password, ...userwopass } = user;
    return userwopass;
  }

  remove(id: string) {
    const indexUser = this.dataBase.users.findIndex((item) => item.id === id);

    if (indexUser === -1) {
      throw new NotFoundException('User not found');
    }
    this.dataBase.users.splice(indexUser, 1);

    return;
  }
}
