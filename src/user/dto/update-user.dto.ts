import { IsNotEmpty, IsString } from 'class-validator';

class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export { UpdateUserDto };
