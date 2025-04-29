import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown, action: string): never {
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
