import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UsersStore } from '../interfaces/user-storage.interface';

@Injectable()
export class RepositoryUsersStorage implements UsersStore {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getAll = async (): Promise<UserEntity[]> => {
    return this.userRepository.find();
  };

  getById = async (userId: string): Promise<UserEntity> => {
    const user = this.userRepository.findOne({ where: { id: userId } });
    return user;
  };

  getByLogin = async (userLogin: string): Promise<UserEntity | null> => {
    const user = this.userRepository.findOne({ where: { login: userLogin } });
    return user;
  };

  update = async (id: string, dto: UpdatePasswordDto): Promise<UserEntity> => {
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
  };

  create = async (dto: CreateUserDto): Promise<UserEntity> => {
    const createdUser = this.userRepository.create(dto);
    const savedUser = this.userRepository.save(createdUser);
    return savedUser;
  };

  remove = async (id: string): Promise<boolean> => {
    const deletionRes = await this.userRepository.delete(id);
    if (deletionRes.affected === 0) {
      return false;
    } else return true;
  };
}
