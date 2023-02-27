import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { storageRefreshToken } from './storage.refresh-token';
import 'dotenv/config';
import { RefreshPayload } from './interfaces/auth.interfaces';
import { TYPE_REFRESH_TOKEN, Errors_Messages } from '../utils/constants';
import { LoginPasswordDto } from './dto/login-password.dto';
import { IAuthAnswer } from './interfaces/auth.interfaces';

const { TOKEN_REFRESH_EXPIRE_TIME, TOKEN_EXPIRE_TIME, JWT_SECRET_KEY } =
  process.env;

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(loginPasswordDto: LoginPasswordDto) {
    const { login, password } = loginPasswordDto;
    const accessToken = await this.getAccessToken(login, password);
    const refreshToken = await this.getRefreshToken();
    const authAnswer: IAuthAnswer = {
      accessToken: accessToken.accessToken,
      refreshToken: refreshToken.token,
    };
    await this.saveRefreshToken(refreshToken.id, accessToken.id);
    return authAnswer;
  }

  async refresh(bodyRefreshToken: { refreshToken: string }) {
    const { refreshToken } = bodyRefreshToken;

    if (!refreshToken) {
      throw new HttpException(
        Errors_Messages.REFRESH_TOKEN_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userId = await this.checkRefreshToken(refreshToken);
    const accessToken = await this.getAccessTokenByUserId(userId);
    const newRefreshToken = await this.getRefreshToken();
    const authAnswer: IAuthAnswer = {
      accessToken: accessToken.accessToken,
      refreshToken: newRefreshToken.token,
    };
    await this.saveRefreshToken(newRefreshToken.id, accessToken.id);
    return authAnswer;
  }

  private async getAccessToken(userLogin: string, userPassword: string) {
    const user = await this.userService.findByLogin(userLogin);
    if (!user) {
      throw new HttpException(
        Errors_Messages.ERROR_LOGIN_PSW,
        HttpStatus.FORBIDDEN,
      );
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        userPassword,
        user.password,
      );
      if (!isPasswordCorrect)
        throw new HttpException(
          Errors_Messages.ERROR_LOGIN_PSW,
          HttpStatus.FORBIDDEN,
        );
    }

    const { id, login } = user;
    const accessToken = jwt.sign(
      { userId: id, login },
      <jwt.Secret>JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRE_TIME },
    );
    return { id, accessToken };
  }

  private async getAccessTokenByUserId(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException(
        Errors_Messages.ERROR_LOGIN_PSW,
        HttpStatus.FORBIDDEN,
      );
    }

    const { id, login } = user;
    const accessToken = jwt.sign(
      { userId: id, login },
      <jwt.Secret>JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRE_TIME },
    );
    return { id, accessToken };
  }

  private async getRefreshToken() {
    const payload: RefreshPayload = { id: uuid(), type: TYPE_REFRESH_TOKEN };
    const token = jwt.sign(payload, <jwt.Secret>JWT_SECRET_KEY, {
      expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
    });
    return { id: payload.id, token };
  }

  private async checkRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, JWT_SECRET_KEY) as RefreshPayload;
      if (!payload.type) {
        throw new HttpException(
          Errors_Messages.INVALID_TOKEN,
          HttpStatus.FORBIDDEN,
        );
      } else if (payload.type !== TYPE_REFRESH_TOKEN) {
        throw new HttpException(
          Errors_Messages.INVALID_TOKEN,
          HttpStatus.FORBIDDEN,
        );
      } else if (storageRefreshToken.refreshTokenId !== payload.id) {
        throw new HttpException(
          Errors_Messages.INVALID_TOKEN,
          HttpStatus.FORBIDDEN,
        );
      } else if (storageRefreshToken.refreshTokenId == payload.id) {
        return storageRefreshToken.userId;
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException(
          Errors_Messages.TOKEN_EXPIRED,
          HttpStatus.FORBIDDEN,
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new HttpException(
          Errors_Messages.INVALID_TOKEN,
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw error;
      }
    }
  }

  private async saveRefreshToken(tokenId: string, userId: string) {
    storageRefreshToken.refreshTokenId = tokenId;
    storageRefreshToken.userId = userId;
  }
}
