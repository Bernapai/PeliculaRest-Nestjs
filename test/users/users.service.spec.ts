import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { UsersService } from '@/users/services/users.service';
import { User, UserRole } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

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

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.getAll();

      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database fails', async () => {
      const dbError = new Error('Database connection failed');
      mockRepository.find.mockRejectedValue(dbError);

      await expect(service.getAll()).rejects.toThrow(dbError);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle query timeout', async () => {
      const timeoutError = new Error('Query timeout');
      mockRepository.find.mockRejectedValue(timeoutError);

      await expect(service.getAll()).rejects.toThrow(timeoutError);
    });
  });

  describe('getOne', () => {
    it('should return a user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getOne(1);

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getOne(999);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should handle invalid ID type', async () => {
      const invalidId = NaN;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getOne(invalidId);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: invalidId } });
    });

    it('should throw error when database fails', async () => {
      const dbError = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(dbError);

      await expect(service.getOne(1)).rejects.toThrow(dbError);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle negative ID values', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getOne(-1);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: -1 } });
    });
  });

  describe('findByName', () => {
    it('should return a user when found by name', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByName('testuser');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'testuser' } });
    });

    it('should return null when user not found by name', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('nonexistent');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'nonexistent' } });
    });

    it('should handle empty string name', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: '' } });
    });

    it('should handle case sensitivity', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('TESTUSER');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'TESTUSER' } });
    });

    it('should throw error when database fails', async () => {
      const dbError = new Error('Database connection error');
      mockRepository.findOne.mockRejectedValue(dbError);

      await expect(service.findByName('testuser')).rejects.toThrow(dbError);
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
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.register(createUserDto);

      expect(result).toEqual(createdUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should handle duplicate name constraint', async () => {
      const duplicateError = new Error('Duplicate entry');
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(service.register(createUserDto)).rejects.toThrow(duplicateError);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle database constraints', async () => {
      const constraintError = new Error('Check constraint violation');
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockRejectedValue(constraintError);

      await expect(service.register(createUserDto)).rejects.toThrow(constraintError);
    });

    it('should handle transaction rollback', async () => {
      const transactionError = new Error('Transaction aborted');
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockRejectedValue(transactionError);

      await expect(service.register(createUserDto)).rejects.toThrow(transactionError);
    });

    it('should create user with default role', async () => {
      const dtoWithoutRole = { name: 'newuser', password: 'password123' } as CreateUserDto;
      const userWithDefaultRole = { ...mockUser, ...dtoWithoutRole, role: UserRole.USER };

      mockRepository.create.mockReturnValue(userWithDefaultRole);
      mockRepository.save.mockResolvedValue(userWithDefaultRole);

      const result = await service.register(dtoWithoutRole);

      expect(result.role).toBe(UserRole.USER);
      expect(repository.create).toHaveBeenCalledWith(dtoWithoutRole);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'updateduser',
      role: UserRole.ADMIN,
    };

    it('should update user successfully', async () => {
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found for update', async () => {
      const updateResult: UpdateResult = { affected: 0, raw: [], generatedMaps: [] };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateUserDto);

      expect(result).toBeNull();
      expect(repository.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateUserDto = { name: 'newname' };
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      const updatedUser = { ...mockUser, name: 'newname' };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, partialUpdate);

      expect(result).toEqual(updatedUser);
      expect(repository.update).toHaveBeenCalledWith(1, partialUpdate);
    });

    it('should handle empty update data', async () => {
      const emptyUpdate: UpdateUserDto = {};
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.update(1, emptyUpdate);

      expect(result).toEqual(mockUser);
      expect(repository.update).toHaveBeenCalledWith(1, emptyUpdate);
    });

    it('should throw error when update fails', async () => {
      const updateError = new Error('Update constraint violation');
      mockRepository.update.mockRejectedValue(updateError);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(updateError);
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should handle database connection issues during update', async () => {
      const connectionError = new Error('Connection lost');
      mockRepository.update.mockRejectedValue(connectionError);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(connectionError);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when user not found for deletion', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(999);

      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });

    it('should handle undefined affected count', async () => {
      const deleteResult: DeleteResult = { affected: undefined, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(1);

      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle null affected count', async () => {
      const deleteResult: DeleteResult = { affected: null, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(1);

      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when delete fails', async () => {
      const deleteError = new Error('Foreign key constraint violation');
      mockRepository.delete.mockRejectedValue(deleteError);

      await expect(service.delete(1)).rejects.toThrow(deleteError);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle invalid ID for deletion', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(NaN);

      expect(result).toBe(false);
      expect(repository.delete).toHaveBeenCalledWith(NaN);
    });

    it('should handle cascade deletion errors', async () => {
      const cascadeError = new Error('Cannot delete due to foreign key constraints');
      mockRepository.delete.mockRejectedValue(cascadeError);

      await expect(service.delete(1)).rejects.toThrow(cascadeError);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection timeout', async () => {
      const timeoutError = new Error('Connection timeout');
      mockRepository.find.mockRejectedValue(timeoutError);

      await expect(service.getAll()).rejects.toThrow(timeoutError);
    });

    it('should handle transaction deadlock', async () => {
      const deadlockError = new Error('Deadlock detected');
      mockRepository.save.mockRejectedValue(deadlockError);

      const createUserDto: CreateUserDto = {
        name: 'testuser',
        password: 'password123',
        role: UserRole.USER,
      };

      mockRepository.create.mockReturnValue(mockUser);

      await expect(service.register(createUserDto)).rejects.toThrow(deadlockError);
    });

    it('should handle memory allocation errors', async () => {
      const memoryError = new Error('Out of memory');
      mockRepository.find.mockRejectedValue(memoryError);

      await expect(service.getAll()).rejects.toThrow(memoryError);
    });

    it('should handle SQL injection attempts', async () => {
      const sqlError = new Error('SQL syntax error');
      mockRepository.findOne.mockRejectedValue(sqlError);

      await expect(service.findByName("'; DROP TABLE users; --")).rejects.toThrow(sqlError);
    });

    it('should handle repository not available', async () => {
      const repositoryError = new Error('Repository not initialized');
      mockRepository.find.mockRejectedValue(repositoryError);

      await expect(service.getAll()).rejects.toThrow(repositoryError);
    });
  });
});