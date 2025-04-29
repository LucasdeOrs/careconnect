import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown, action: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException('Já existe um usuário com essas credenciais.');
      case 'P2025':
        throw new NotFoundException(`Usuário não encontrado para ${action}.`);
    }
  }
  throw new InternalServerErrorException('Erro interno ao processar a requisição.');
}
