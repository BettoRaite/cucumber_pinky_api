import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { db } from 'src/database';
import { refreshTokensTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(signUpDto: AuthDto) {
    const hasUser = await this.usersService.findOneBy({
      email: signUpDto.email,
    });
    if (hasUser) {
      throw new ConflictException();
    }
    const hash = await bcrypt.hash(signUpDto.password, saltOrRounds);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hash,
    });
    return user;
  }
  async signIn(signInDto: AuthDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findOneBy({
      email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid password. Please try again.');
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid password. Please try again.');
    }
    return user;
  }
  async createRefreshToken(refreshToken: string, userId: number) {
    await db.insert(refreshTokensTable).values({
      token: refreshToken,
      userId: userId,
    });
  }
  async findRefreshToken(token: string = '') {
    const result = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.token, token));
    return result.at(0);
  }
  async deleteRefreshToken(token: string = '') {
    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.token, token));
  }
  async deleteAllRefreshTokens(userId: number) {
    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId));
  }
  // async authenticateToken(refreshToken: string, userId: number) {}
}
