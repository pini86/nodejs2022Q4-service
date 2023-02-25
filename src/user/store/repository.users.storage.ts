import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RepositoryUsersStorage {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getById(userId: string): Promise<UserEntity> {
    const user = this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async getByLogin(userLogin: string): Promise<UserEntity | null> {
    const user = this.userRepository.findOneBy({ login: userLogin });
    return user;
  }

  async update(id: string, dto: UpdatePasswordDto): Promise<UserEntity> {
    const user = await this.getById(id);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        dto.oldPassword,
        user.password,
      );
      if (isPasswordCorrect) {
        user.password = dto.newPassword;
        await this.userRepository.save(user);
        return user;
      } else {
        throw new ForbiddenException();
      }
    }
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const createdUser = this.userRepository.create(dto);
    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
  }

  async remove(id: string): Promise<boolean> {
    const deletionRes = await this.userRepository.delete(id);
    if (deletionRes.affected === 0) {
      return false;
    } else return true;
  }
}
