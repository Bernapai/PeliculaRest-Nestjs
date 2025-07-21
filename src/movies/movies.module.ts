import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './controllers/movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/movie.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula]), AuthModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule { }
