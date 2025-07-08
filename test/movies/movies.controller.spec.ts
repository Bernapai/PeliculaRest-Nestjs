import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from 'src/movies/controllers/movies.controller';
import { MoviesService } from 'src/movies/services/movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
