import { UserType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;
}
