import { UserType } from '@prisma/client';

export interface JwtPayload {
  fullName: string;
  sub: string;
  email: string;
  userType: UserType;
}
