import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { Public } from 'src/utils/public';
import { UsersService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginPasswordDto } from './dto/login-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  @Public()
  async signup(@Body() loginPasswordDto: LoginPasswordDto) {
    return this.usersService.create(loginPasswordDto);
  }

  @Post('/login')
  @HttpCode(StatusCodes.OK)
  @Public()
  async login(@Body() loginPasswordDto: LoginPasswordDto) {
    return await this.authService.login(loginPasswordDto);
  }

  @Post('/refresh')
  @HttpCode(StatusCodes.OK)
  @Public()
  async refresh(@Body() bodyRefreshToken: { refreshToken: string }) {
    return await this.authService.refresh(bodyRefreshToken);
  }
}
