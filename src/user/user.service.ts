import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataBaseInMemory } from '../db/exp.db';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as uuid from 'uuid';

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
    // const newUser = new UserEntity({
    const newUser = Object.assign(new UserEntity(), {
      id: uuid.v4(),
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
      ...createUserDto,
    });
    this.dataBase.users.push(newUser);
    return newUser;
  }
}
