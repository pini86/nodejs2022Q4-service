import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { validateID } from '../utils/validate';
import { UserResponse } from './interfaces/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getAll(): UserResponse[] {
    return this.UserService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): UserResponse {
    validateID(id);
    return this.UserService.getOne(id);
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto): UserEntity {
    return this.UserService.create(CreateUserDto);
  }
}
