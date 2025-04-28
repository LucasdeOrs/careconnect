import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class AuthDto extends PickType(CreateUserDto, ['email', 'password', 'fullName', 'userType'] as const) {}
