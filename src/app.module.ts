import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './features/users/users.controller';
import { AuthController } from './features/auth/auth.controller';
import { AuthModule } from './features/auth/auth.module';
import { UsersService } from './features/users/users.service';
import { UsersModule } from './features/users/users.module';
import { AuthService } from './features/auth/auth.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {}
