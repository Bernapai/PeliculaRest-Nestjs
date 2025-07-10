import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/controllers/users.controller';
import { UsersService } from '@/users/services/users.service';
import { User, UserRole } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: 2,
      name: 'adminuser',
      password: 'hashedPassword',
      role: UserRole.ADMIN,
    },
  ];

  const mockUsersService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    register: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.getAll.mockResolvedValue(mockUsers);

      const result = await controller.getAll();

      expect(result).toEqual(mockUsers);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.getAll.mockResolvedValue([]);

      const result = await controller.getAll();

      expect(result).toEqual([]);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database connection failed');
      mockUsersService.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow(error);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('should return a user when found', async () => {
      mockUsersService.getOne.mockResolvedValue(mockUser);

      const result = await controller.getOne(1);

      expect(result).toEqual(mockUser);
      expect(service.getOne).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      mockUsersService.getOne.mockResolvedValue(null);

      const result = await controller.getOne(999);

      expect(result).toBeNull();
      expect(service.getOne).toHaveBeenCalledWith(999);
    });

    it('should handle invalid ID format', async () => {
      const invalidId = NaN;
      mockUsersService.getOne.mockResolvedValue(null);

      const result = await controller.getOne(invalidId);

      expect(result).toBeNull();
      expect(service.getOne).toHaveBeenCalledWith(invalidId);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Database error');
      mockUsersService.getOne.mockRejectedValue(error);

      await expect(controller.getOne(1)).rejects.toThrow(error);
      expect(service.getOne).toHaveBeenCalledWith(1);
    });
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'newuser',
      password: 'password123',
      role: UserRole.USER,
    };

    it('should create a new user successfully', async () => {
      const createdUser = { ...mockUser, ...createUserDto };
      mockUsersService.register.mockResolvedValue(createdUser);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(createdUser);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle duplicate user creation', async () => {
      const duplicateError = new BadRequestException('User already exists');
      mockUsersService.register.mockRejectedValue(duplicateError);

      await expect(controller.register(createUserDto)).rejects.toThrow(duplicateError);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle validation errors', async () => {
      const validationError = new BadRequestException('Validation failed');
      mockUsersService.register.mockRejectedValue(validationError);

      await expect(controller.register(createUserDto)).rejects.toThrow(validationError);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle database errors during creation', async () => {
      const dbError = new Error('Database constraint violation');
      mockUsersService.register.mockRejectedValue(dbError);

      await expect(controller.register(createUserDto)).rejects.toThrow(dbError);
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'updateduser',
      role: UserRole.ADMIN,
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should return null when user not found', async () => {
      mockUsersService.update.mockResolvedValue(null);

      const result = await controller.update(999, updateUserDto);

      expect(result).toBeNull();
      expect(service.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateUserDto = { name: 'newname' };
      const updatedUser = { ...mockUser, name: 'newname' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, partialUpdate);

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, partialUpdate);
    });

    it('should handle empty update data', async () => {
      const emptyUpdate: UpdateUserDto = {};
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update(1, emptyUpdate);

      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, emptyUpdate);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Update failed');
      mockUsersService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateUserDto)).rejects.toThrow(error);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      mockUsersService.delete.mockResolvedValue(true);

      const result = await controller.delete(1);

      expect(result).toBe(true);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when user not found', async () => {
      mockUsersService.delete.mockResolvedValue(false);

      const result = await controller.delete(999);

      expect(result).toBe(false);
      expect(service.delete).toHaveBeenCalledWith(999);
    });

    it('should handle invalid ID for deletion', async () => {
      const invalidId = NaN;
      mockUsersService.delete.mockResolvedValue(false);

      const result = await controller.delete(invalidId);

      expect(result).toBe(false);
      expect(service.delete).toHaveBeenCalledWith(invalidId);
    });

    it('should throw error when service fails', async () => {
      const error = new Error('Delete operation failed');
      mockUsersService.delete.mockRejectedValue(error);

      await expect(controller.delete(1)).rejects.toThrow(error);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should handle database constraint errors', async () => {
      const constraintError = new Error('Foreign key constraint violation');
      mockUsersService.delete.mockRejectedValue(constraintError);

      await expect(controller.delete(1)).rejects.toThrow(constraintError);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle service unavailable errors', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      mockUsersService.getAll.mockRejectedValue(serviceError);

      await expect(controller.getAll()).rejects.toThrow(serviceError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockUsersService.getOne.mockRejectedValue(timeoutError);

      await expect(controller.getOne(1)).rejects.toThrow(timeoutError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockUsersService.register.mockRejectedValue(networkError);

      const createUserDto: CreateUserDto = {
        name: 'testuser',
        password: 'password123',
        role: UserRole.USER,
      };

      await expect(controller.register(createUserDto)).rejects.toThrow(networkError);
    });
  });
});