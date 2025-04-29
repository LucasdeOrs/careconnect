import { UserType } from '@prisma/client';

export class User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  userType: UserType;
  birthDate?: Date;
  address?: string;
  createdAt: Date;
}

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  userType: UserType;
  birthDate?: Date;
  address?: string;
  createdAt: Date;
}
