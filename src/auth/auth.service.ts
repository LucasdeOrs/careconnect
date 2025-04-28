import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto) {
    const user = await this.usersService.create(authDto);
    return this.signToken(user.id, user.email);
  }

  async signin(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);

    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(authDto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
