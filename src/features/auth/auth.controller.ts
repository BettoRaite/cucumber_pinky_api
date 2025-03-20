import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  UnauthorizedException,
  BadRequestException,
  Req,
  Get,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import config from 'src/config/config';
import {
  accessTokenCookieConfig,
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from 'src/config/cookieConfig';
import { AuthService } from './auth.service';
import { JwtService } from './jwt/jwt.service';
import { UsersService } from '../users/users.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: AuthDto) {
    await this.authService.signUp(signUpDto);
    return { message: 'Successfull sign up' };
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signIn(signInDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    const cookieRefreshToken = req.cookies[
      config.jwt.refresh_token.cookieName
    ] as string;

    // Refresh cookie clean up
    if (cookieRefreshToken) {
      const storedRefreshToken =
        await this.authService.findRefreshToken(cookieRefreshToken);
      if (storedRefreshToken?.userId !== user.id) {
        await this.authService.deleteAllRefreshTokens(user.id);
      } else {
        await this.authService.deleteRefreshToken(cookieRefreshToken);
      }
      res.clearCookie(
        config.jwt.access_token.cookieName,
        clearRefreshTokenCookieConfig,
      );
    }

    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: user.id,
    });
    await this.authService.createRefreshToken(refreshToken, user.id);

    res.cookie(
      config.jwt.access_token.cookieName,
      accessToken,
      accessTokenCookieConfig,
    );
    res.cookie(
      config.jwt.refresh_token.cookieName,
      refreshToken,
      refreshTokenCookieConfig,
    );
    return { data: user };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const storedRefreshToken = await this.authService.findRefreshToken(
      req.cookies[config.jwt.refresh_token.cookieName] as undefined,
    );
    if (!storedRefreshToken) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: storedRefreshToken.id,
    });
    // clean up
    await this.authService.deleteRefreshToken(storedRefreshToken.token);
    // create
    await this.authService.createRefreshToken(
      refreshToken,
      storedRefreshToken.userId,
    );
    res.clearCookie(
      config.jwt.access_token.cookieName,
      clearRefreshTokenCookieConfig,
    );
    res.cookie(
      config.jwt.access_token.cookieName,
      accessToken,
      accessTokenCookieConfig,
    );
    res.cookie(
      config.jwt.refresh_token.cookieName,
      refreshToken,
      refreshTokenCookieConfig,
    );
  }
  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieRefreshToken = req.cookies[
      config.jwt.refresh_token.cookieName
    ] as string;
    if (!cookieRefreshToken) {
      throw new BadRequestException(); // No content
    }
    this.authService.deleteRefreshToken(cookieRefreshToken);
    res.clearCookie(
      config.jwt.access_token.cookieName,
      clearRefreshTokenCookieConfig,
    );
    res.clearCookie(config.jwt.access_token.cookieName);
  }
  @Get('')
  @HttpCode(HttpStatus.OK)
  async auth(@Req() req: Request) {
    const user = await this.usersService.findOneBy({
      id: req.user?.['id'] as number,
    });
    return { data: user };
  }
}
