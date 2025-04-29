import { UserType } from '@prisma/client';

export class User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  userType: UserType;
  birthDate: Date | null;
  address: string | null;
  createdAt: Date;
}

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  userType: UserType;
  birthDate: Date | null;
  address: string | null;
  createdAt: Date;
}
