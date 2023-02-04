import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  async getAll(): Promise<UserResponse[]> {
    return this.UserService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<UserResponse> {
    validateID(id);
    return this.UserService.getOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.UserService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    validateID(id);
    return this.UserService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    validateID(id);
    await this.UserService.remove(id);
  }
}
