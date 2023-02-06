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
import { Errors_Messages } from '../utils/constants';

@Injectable()
export class UsersService {
  private readonly users = [];

  async getAll() {
    return this.users;
  }

  async getOne(id: string) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(Errors_Messages.USER_NOT_FOUND);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    if (this.users.find((item) => item.login === createUserDto.login)) {
      throw new ConflictException(Errors_Messages.USER_EXISTS);
    }
    const dateNow = Date.now();
    const newUser = new User({
      id: uuid.v4(),
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...createUserDto,
    });

    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(Errors_Messages.USER_NOT_FOUND);
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (user.password !== oldPassword) {
      throw new ForbiddenException(Errors_Messages.WRONG_PASSWORD);
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  async remove(id: string) {
    const indexUser = this.users.findIndex((item) => item.id === id);

    if (indexUser === -1) {
      throw new NotFoundException(Errors_Messages.USER_NOT_FOUND);
    }

    this.users.splice(indexUser, 1);
  }
}
