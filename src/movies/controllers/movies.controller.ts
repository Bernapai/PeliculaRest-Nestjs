import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { CreatePeliculaDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Pelicula } from '../entities/movie.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('peliculas') // ← Agrupa estos endpoints bajo "peliculas" en Swagger
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas las películas' })
  @ApiResponse({ status: 200, description: 'Películas encontradas', type: [Pelicula] })
  findAll(): Promise<Pelicula[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una película por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Película encontrada', type: Pelicula })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  findOne(@Param('id') id: number): Promise<Pelicula> {
    return this.moviesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva película' })
  @ApiBody({ type: CreatePeliculaDto })
  @ApiResponse({ status: 201, description: 'Película creada', type: Pelicula })
  create(@Body() createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
    return this.moviesService.create(createPeliculaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una película existente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({ status: 200, description: 'Película actualizada', type: Pelicula })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Pelicula> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una película por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Película eliminada' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(id);
  }
}
