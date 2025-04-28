import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserInterface } from '../interface/current-user.interface';
import { AuthRequest } from '../interface/auth-request.interface';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): CurrentUserInterface => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  return request.user;
});

export const CurrentUserId = createParamDecorator((data: unknown, ctx: ExecutionContext): string | undefined => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  return request.user?.userId;
});
