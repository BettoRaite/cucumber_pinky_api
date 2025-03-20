import { CookieOptions } from 'express';

export const accessTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000, // 1 hour
};
export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000, // 1 hour
};

export const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};
