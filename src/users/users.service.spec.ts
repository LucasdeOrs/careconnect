import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const user = {
    id: 'user-id',
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword',
    userType: 'FAMILY' as const,
    createdAt: new Date(),
  };

  const createUserDto: CreateUserDto = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword',
    userType: 'FAMILY',
  };

  const updateUserDto: UpdateUserDto = {
    fullName: 'John Doe Updated',
  };

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue(user),
      findMany: jest.fn().mockResolvedValue([user]),
      findUnique: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue({ ...user, ...updateUserDto }),
      delete: jest.fn().mockResolvedValue(user),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([user]);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const result = await service.findOne(user.id);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const result = await service.update(user.id, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: updateUserDto,
      });
      expect(result).toEqual({ ...user, ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should delete and return the user', async () => {
      const result = await service.remove(user.id);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(user);
    });
  });
});
