import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import config from 'src/config/config';

@Injectable()
export class JwtService {
  generateAccessToken(payload: object): string {
    return sign(payload, config.jwt.access_token.secret, {
      // The expiresIn prop value must be StringValue type
      // e.g "1d", "1h"
      expiresIn: config.jwt.access_token.expire as unknown as number,
    });
  }

  generateRefreshToken(payload: object = {}): string {
    return sign(payload, config.jwt.refresh_token.secret, {
      expiresIn: config.jwt.refresh_token.expire as unknown as number,
    });
  }

  generateTokens(accessTokenPayload: object, refreshTokenPayload?: object) {
    const accessToken = this.generateAccessToken(accessTokenPayload);
    const refreshToken = this.generateRefreshToken(refreshTokenPayload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      verify(token, config.jwt.access_token.secret, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      });
    });
  }

  async verifyRefreshToken(token: string) {
    return new Promise((resolve, reject) => {
      verify(token, config.jwt.refresh_token.secret, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      });
    });
  }
}
