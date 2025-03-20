import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { AuthGuard } from './features/auth/auth.guard';
import { AuthModule } from './features/auth/auth.module';
import { ActivitiesModule } from './features/activities/activities.module';
import { UsersModule } from './features/users/users.module';
import { JwtModule } from './features/auth/jwt/jwt.module';
import { JwtService } from './features/auth/jwt/jwt.service';
@Module({
  imports: [AuthModule, JwtModule, ActivitiesModule, UsersModule],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
