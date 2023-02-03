/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as uuid from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly users = [];

  async getAll() {
    return this.users;
  }

  async getOne(id: string) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userwopass } = user;
    return userwopass;
  }

  async create(createUserDto: CreateUserDto) {
    if (this.users.find((item) => item.login === createUserDto.login)) {
      throw new ConflictException('User already exists');
    }
    const dateNow = Date.now();
    const newUser = Object.assign(new User(), {
      id: uuid.v4(),
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...createUserDto,
    });

    this.users.push(newUser);
    const { password, ...userwopass } = newUser;
    return userwopass;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Wrong password');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password, ...userwopass } = user;
    return userwopass;
  }

  async remove(id: string) {
    const indexUser = this.users.findIndex((item) => item.id === id);

    if (indexUser === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(indexUser, 1);
  }
}
