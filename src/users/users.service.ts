import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PasswordService } from 'src/common/service/password.service';
import { UserResponseDto } from './entities/user.entity';
import { handlePrismaError } from 'src/prisma/utils/prisma-error.util';
import { toUserResponseDto } from './mapper/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return toUserResponseDto(user);
    } catch (error) {
      handlePrismaError(error, 'criar');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => toUserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return toUserResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const data: Partial<UpdateUserDto> = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await this.passwordService.hashPassword(updateUserDto.password);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return toUserResponseDto(user);
    } catch (error) {
      handlePrismaError(error, 'atualizar');
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      return toUserResponseDto(user);
    } catch (error) {
      handlePrismaError(error, 'remover');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
