import { UserType } from '@prisma/client';

export interface CurrentUserInterface {
  userId: string;
  email: string;
  userType: UserType;
}
