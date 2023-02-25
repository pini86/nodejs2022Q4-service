//import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { storageRefreshToken } from './storage.refresh-token';
import 'dotenv/config';
//const PORT = process.env.PORT || 4000;
//dotenv.config();

const { TOKEN_REFRESH_EXPIRE_TIME, TOKEN_EXPIRE_TIME, JWT_SECRET_KEY } =
  process.env;

type RefreshPayload = { id: string; type: string };
const TYPE_REFRESH_TOKEN = 'refresh';
const MSG_ERROR_INVALID_TOKEN = 'Invalid token!';
const MSG_ERROR_TOKEN_EXPIRED = 'Token expired!';
const MSG_ERROR_LOGIN_PSW = `Login or password isn't correct`;

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  getAccessToken = async (userLogin: string, userPassword: string) => {
    const user = await this.userService.findByLogin(userLogin);
    console.log(
      'userLogin ',
      userLogin,
      ' user',
      user,
      'userPassword saved',
      userPassword,
    );
    if (!user) {
      throw new HttpException(MSG_ERROR_LOGIN_PSW, HttpStatus.FORBIDDEN);
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        userPassword,
        user.password,
      );
      console.log('isPasswordCorrect ', isPasswordCorrect);
      if (!isPasswordCorrect)
        throw new HttpException(MSG_ERROR_LOGIN_PSW, HttpStatus.FORBIDDEN);
    }

    const { id, login } = user;
    const accessToken = jwt.sign(
      { userId: id, login },
      <jwt.Secret>JWT_SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRE_TIME,
      },
    );
    const answer = {
      id,
      accessToken,
    };
    return answer;
  };

  getAccessTokenByUserId = async (userId: string) => {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException(MSG_ERROR_LOGIN_PSW, HttpStatus.FORBIDDEN);
    }

    const { id, login } = user;
    const accessToken = jwt.sign(
      { userId: id, login },
      <jwt.Secret>JWT_SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRE_TIME,
      },
    );
    const answer = {
      id,
      accessToken,
    };
    return answer;
  };

  getRefreshToken = async () => {
    const payload: RefreshPayload = { id: uuid(), type: TYPE_REFRESH_TOKEN };
    const token = jwt.sign(payload, <jwt.Secret>JWT_SECRET_KEY, {
      expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
    });
    return {
      id: payload.id,
      token,
    };
  };

  checkRefreshToken = async (token: string) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET_KEY) as RefreshPayload;
      if (!payload.type) {
        throw new HttpException(MSG_ERROR_INVALID_TOKEN, HttpStatus.FORBIDDEN);
      } else if (payload.type !== TYPE_REFRESH_TOKEN) {
        throw new HttpException(MSG_ERROR_INVALID_TOKEN, HttpStatus.FORBIDDEN);
      } else if (storageRefreshToken.refreshTokenId !== payload.id) {
        throw new HttpException(MSG_ERROR_INVALID_TOKEN, HttpStatus.FORBIDDEN);
      } else if (storageRefreshToken.refreshTokenId == payload.id) {
        return storageRefreshToken.userId;
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException(MSG_ERROR_TOKEN_EXPIRED, HttpStatus.FORBIDDEN);
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new HttpException(MSG_ERROR_INVALID_TOKEN, HttpStatus.FORBIDDEN);
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
