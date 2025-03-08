import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: AuthDto) {
    await this.usersService.create(signUpDto);
    return { message: 'Successfull sign up' };
  }
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: AuthDto) {
    const user = await this.usersService.findOneBy({
      email: signInDto.email,
    });
    console.log(await this.usersService.findAll());
    if (!user) {
      throw new ForbiddenException();
    }
    return { data: user };
  }
}
