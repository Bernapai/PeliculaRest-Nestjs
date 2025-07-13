import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '@/movies/controllers/movies.controller';
import { MoviesService } from '@/movies/services/movies.service';
import { Pelicula } from '@/movies/entities/movie.entity';
import { CreatePeliculaDto } from '@/movies/dto/create-movie.dto';
import { UpdateMovieDto } from '@/movies/dto/update-movie.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

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
      titulo: 'The Matrix',
      descripcion: 'A computer hacker learns about the true nature of reality',
      anio: 1999,
      genero: 'Action',
      calificacion: 8.7,
    },
  ];

  const mockMoviesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockMovies);
      const result = await controller.findAll();
      expect(result).toEqual(mockMovies);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no movies exist', async () => {
      mockMoviesService.findAll.mockResolvedValue([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
    });

    it('should throw an error if service fails', async () => {
      const error = new Error('Database failure');
      mockMoviesService.findAll.mockRejectedValue(error);
      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      mockMoviesService.findOne.mockResolvedValue(mockMovie);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockMovie);
    });

    it('should return null if movie not found', async () => {
      mockMoviesService.findOne.mockResolvedValue(null);
      const result = await controller.findOne(999);
      expect(result).toBeNull();
    });

    it('should throw an error if service fails', async () => {
      const error = new Error('Service error');
      mockMoviesService.findOne.mockRejectedValue(error);
      await expect(controller.findOne(1)).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    const createDto: CreatePeliculaDto = {
      titulo: 'Interstellar',
      descripcion: 'A space exploration epic',
      anio: 2014,
      genero: 'Sci-Fi',
      calificacion: 8.6,
    };

    it('should create and return a new movie', async () => {
      const createdMovie = { id: 3, ...createDto };
      mockMoviesService.create.mockResolvedValue(createdMovie);

      const result = await controller.create(createDto);
      expect(result).toEqual(createdMovie);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for duplicate movie', async () => {
      const error = new BadRequestException('Movie already exists');
      mockMoviesService.create.mockRejectedValue(error);
      await expect(controller.create(createDto)).rejects.toThrow(error);
    });

    it('should throw general error on DB failure', async () => {
      const error = new Error('Constraint error');
      mockMoviesService.create.mockRejectedValue(error);
      await expect(controller.create(createDto)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const updateDto: UpdateMovieDto = {
      titulo: 'Inception Reloaded',
      calificacion: 9.2,
    };

    it('should update and return the updated movie', async () => {
      const updatedMovie = { ...mockMovie, ...updateDto };
      mockMoviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.update(1, updateDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should return null if movie not found', async () => {
      mockMoviesService.update.mockResolvedValue(null);
      const result = await controller.update(999, updateDto);
      expect(result).toBeNull();
    });

    it('should throw error if update fails', async () => {
      const error = new Error('Update error');
      mockMoviesService.update.mockRejectedValue(error);
      await expect(controller.update(1, updateDto)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should delete the movie and return void', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);
      const result = await controller.remove(1);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw error if deletion fails', async () => {
      const error = new Error('Delete failed');
      mockMoviesService.remove.mockRejectedValue(error);
      await expect(controller.remove(1)).rejects.toThrow(error);
    });
  });
});
