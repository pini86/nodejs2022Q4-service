import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPasswordDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
