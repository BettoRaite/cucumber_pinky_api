import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    @Res() res: Response,
    email: string,
    pass: string,
  ): Promise<any> {
    const user = await this.usersService.findOneBy({
      email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {},
    );

    return user;
  }
}
