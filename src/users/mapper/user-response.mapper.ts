import { User } from '@prisma/client';
import { UserResponseDto } from '../entities/user.entity';

export function toUserResponseDto(user: User): UserResponseDto {
  const { password: _, ...rest } = user;
  return rest as UserResponseDto;
}
