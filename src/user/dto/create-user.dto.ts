import { IsNotEmpty, IsString } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export { CreateUserDto };
