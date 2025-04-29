import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../interface/auth-request.interface';

export const CurrentUser = createParamDecorator((data: 'userId' | 'email' | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  const user = request.user;

  if (!user) return undefined;

  if (data) {
    return user[data];
  }

  return user;
});
