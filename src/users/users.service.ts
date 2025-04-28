import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PasswordService } from 'src/common/service/password.service';
import { UserResponseDto } from './entities/user.entity';

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

      return this.toResponseDto(user);
    } catch (error) {
      this.handlePrismaError(error, 'criar');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.toResponseDto(user);
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

      return this.toResponseDto(user);
    } catch (error) {
      this.handlePrismaError(error, 'atualizar');
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      return this.toResponseDto(user);
    } catch (error) {
      this.handlePrismaError(error, 'remover');
    }
  }

  private toResponseDto(user: User): UserResponseDto {
    const { password: _, ...rest } = user;
    return rest as UserResponseDto;
  }

  private handlePrismaError(error: unknown, action: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Usuário com essas credenciais já existe.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário não encontrado para ${action}.`);
      }
    }
    throw error;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
