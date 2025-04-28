import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserId } from '../auth/decorators/current-user.decorator';
import { CurrentUserInterface } from './interface/current-user.interface';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@CurrentUser() user: CurrentUserInterface) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@CurrentUserId() userId: string) {
    return { userId };
  }
}
