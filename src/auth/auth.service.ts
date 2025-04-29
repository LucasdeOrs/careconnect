import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PasswordService } from 'src/common/service/password.service';
import { SigninDto } from './dto/signin.dto';
import { User } from '@prisma/client';
import { UserResponseDto } from 'src/users/entities/user.entity';
import { toUserResponseDto } from 'src/users/mapper/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}
  
  async signup(signupDto: SignupDto) {
    const user = await this.usersService.create(signupDto);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    return this.generateAuthResponse(user);
  }
  
  async signin(signinDto: SigninDto) {
    const user = await this.usersService.findByEmail(signinDto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    await this.validateUserCredentials(user, signinDto.password);
    return this.generateAuthResponse(user);
  }

  private async validateUserCredentials(user: User | null, password: string) {
    if (!user || !user.password) throw new UnauthorizedException('Credenciais inválidas');
    const passwordValid = await this.passwordService.comparePassword(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Credenciais inválidas');
  }

  private generateAuthResponse(user: User): { access_token: string; user: UserResponseDto } {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: toUserResponseDto(user),
    };
  }
}
