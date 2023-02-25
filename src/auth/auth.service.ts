import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { storageRefreshToken } from './storage.refresh-token';
import 'dotenv/config';
import { RefreshPayload } from './interfaces/auth.interfaces';
import { TYPE_REFRESH_TOKEN, Errors_Messages } from '../utils/constants';

const { TOKEN_REFRESH_EXPIRE_TIME, TOKEN_EXPIRE_TIME, JWT_SECRET_KEY } =
  process.env;

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  getAccessToken = async (userLogin: string, userPassword: string) => {
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
  };

  getAccessTokenByUserId = async (userId: string) => {
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
  };

  getRefreshToken = async () => {
    const payload: RefreshPayload = { id: uuid(), type: TYPE_REFRESH_TOKEN };
    const token = jwt.sign(payload, <jwt.Secret>JWT_SECRET_KEY, {
      expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
    });
    return { id: payload.id, token };
  };

  checkRefreshToken = async (token: string) => {
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
  };

  saveRefreshToken = async (tokenId: string, userId: string) => {
    storageRefreshToken.refreshTokenId = tokenId;
    storageRefreshToken.userId = userId;
  };
}
