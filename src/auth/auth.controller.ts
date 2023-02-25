import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { Public } from 'src/public';
//import { UserEntity } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginPasswordDto } from './dto/login-password.dto';
import { IAuthAnswer } from './interfaces/auth-answer.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  @Public()
  async signup(@Body() loginPasswordDto: LoginPasswordDto) {
    const user = await this.usersService.create(loginPasswordDto);
    return user;
  }

  @Post('/login')
  @HttpCode(StatusCodes.OK)
  @Public()
  async getTokens(@Body() loginPasswordDto: LoginPasswordDto) {
    const { login, password } = loginPasswordDto;
    const accessToken = await this.authService.getAccessToken(login, password);
    const refreshToken = await this.authService.getRefreshToken();
    const authAnswer: IAuthAnswer = {
      accessToken: accessToken.accessToken,
      refreshToken: refreshToken.token,
    };
    await this.authService.saveRefreshToken(refreshToken.id, accessToken.id);
    return authAnswer;
  }

  @Post('/refresh')
  @HttpCode(StatusCodes.OK)
  @Public()
  async getRefreshTokens(@Body() bodyRefreshToken: { refreshToken: string }) {
    const { refreshToken } = bodyRefreshToken;

    if (!refreshToken) {
      throw new HttpException(
        'No refreshToken in body',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userId = await this.authService.checkRefreshToken(refreshToken);
    const accessToken = await this.authService.getAccessTokenByUserId(userId);
    const newRefreshToken = await this.authService.getRefreshToken();
    const authAnswer: IAuthAnswer = {
      accessToken: accessToken.accessToken,
      refreshToken: newRefreshToken.token,
    };
    this.authService.saveRefreshToken(newRefreshToken.id, accessToken.id);
    return authAnswer;
  }
}
