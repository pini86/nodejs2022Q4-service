import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserResponse } from './entities/user.entity';
import { UserService } from './user.service';
import { validateID } from '../utils/validate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.UserService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    validateID(id);
    return this.UserService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    validateID(id);
    this.UserService.remove(id);
  }
}
