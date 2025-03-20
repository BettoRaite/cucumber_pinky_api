import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserJWT } from 'src/lib/types/types';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request['user'] as UserJWT;
});
