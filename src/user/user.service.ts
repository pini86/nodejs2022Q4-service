import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Errors_Messages } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAll() {
    return this.usersRepository.find();
  }

  async getOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(Errors_Messages.USER_NOT_FOUND);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    if (await this.usersRepository.findOneBy({ login: createUserDto.login })) {
      throw new ConflictException(Errors_Messages.USER_EXISTS);
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.getOne(id);
    if (!user) {
      throw new NotFoundException(Errors_Messages.USER_NOT_FOUND);
    }

    const { oldPassword, newPassword } = updateUserDto;

    if (user.password !== oldPassword) {
      throw new ForbiddenException(Errors_Messages.WRONG_PASSWORD);
    }

    user.password = newPassword;
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.getOne(id);
    return this.usersRepository.remove(user);
  }
}
