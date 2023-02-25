import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './user.service';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(UserEntity.toResponse);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findOne(id);
    if (user) return UserEntity.toResponse(user);
    throw new NotFoundException();
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const user = await this.usersService.create(userDto);
    return UserEntity.toResponse(user);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.usersService.update(id, updatePasswordDto);
    if (user) return UserEntity.toResponse(user);
    throw new NotFoundException();
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const isDeleted = await this.usersService.remove(id);
    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
