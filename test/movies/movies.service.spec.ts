import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { MoviesService } from '@/movies/services/movies.service';
import { Pelicula } from '@/movies/entities/movie.entity';
import { CreatePeliculaDto } from '@/movies/dto/create-movie.dto';
import { UpdateMovieDto } from '@/movies/dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Pelicula>;

  const mockMovie: Pelicula = {
    id: 1,
    titulo: 'Inception',
    descripcion: 'A mind-bending thriller',
    anio: 2010,
    genero: 'Sci-Fi',
    calificacion: 9.0,
  };

  const mockMovies: Pelicula[] = [
    mockMovie,
    {
      id: 2,
      titulo: 'Interstellar',
      descripcion: 'Space-time exploration',
      anio: 2014,
      genero: 'Sci-Fi',
      calificacion: 8.6,
    },
  ];

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(), // AGREGADO: Este era el método que faltaba
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Pelicula),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Pelicula>>(getRepositoryToken(Pelicula));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockRepository.find.mockResolvedValue(mockMovies);
      const result = await service.findAll();
      expect(result).toEqual(mockMovies);
    });

    it('should throw error on failure', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);
      await expect(service.findAll()).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a movie when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockMovie); // CAMBIADO: usar findOneBy
      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // CAMBIADO: verificar findOneBy
    });

    it('should throw error when movie not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null); // CAMBIADO: usar findOneBy
      await expect(service.findOne(999)).rejects.toThrow('Pelicula No encontradda'); // CAMBIADO: tu servicio lanza error, no retorna null
    });

    it('should throw error on DB failure', async () => {
      const error = new Error('Query failed');
      mockRepository.findOneBy.mockRejectedValue(error); // CAMBIADO: usar findOneBy
      await expect(service.findOne(1)).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    const createDto: CreatePeliculaDto = {
      titulo: 'The Matrix',
      descripcion: 'Reality is a simulation',
      anio: 1999,
      genero: 'Action',
      calificacion: 8.7,
    };

    it('should create and return new movie', async () => {
      const createdMovie = { id: 3, ...createDto };
      mockRepository.create.mockReturnValue(createdMovie);
      mockRepository.save.mockResolvedValue(createdMovie);

      const result = await service.create(createDto);

      expect(result).toEqual(createdMovie);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdMovie);
    });

    it('should throw error if save fails', async () => {
      mockRepository.create.mockReturnValue(mockMovie);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(createDto)).rejects.toThrow('Save failed');
    });
  });

  describe('update', () => {
    const updateDto: UpdateMovieDto = {
      titulo: 'Updated Title',
      calificacion: 9.1,
    };

    it('should update and return updated movie', async () => {
      const updatedMovie = { ...mockMovie, ...updateDto };
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOneBy.mockResolvedValue(updatedMovie); // CAMBIADO: usar findOneBy

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should throw error if movie not found after update', async () => {
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOneBy.mockResolvedValue(null); // CAMBIADO: usar findOneBy

      await expect(service.update(999, updateDto)).rejects.toThrow('Pelicula with id 999 not found'); // CAMBIADO: tu servicio lanza error
    });

    it('should throw error if update fails', async () => {
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(1, updateDto)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should return void if delete succeeds', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);
      expect(result).toBeUndefined();
    });

    it('should still return void if no rows affected', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(999);
      expect(result).toBeUndefined();
    });

    it('should throw error if delete fails', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove(1)).rejects.toThrow('Delete failed');
    });
  });
});