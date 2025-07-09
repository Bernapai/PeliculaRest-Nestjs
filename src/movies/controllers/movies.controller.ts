import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { CreatePeliculaDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Pelicula } from '../entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Pelicula> {
    return this.moviesService.findOne(id);
  }

  @Post()
  create(@Body() createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
    return this.moviesService.create(createPeliculaDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto): Promise<Pelicula> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(id);
  }
}