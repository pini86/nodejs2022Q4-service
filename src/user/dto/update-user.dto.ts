import { IsNotEmpty, IsString } from 'class-validator';

class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export { UpdatePasswordDto };
