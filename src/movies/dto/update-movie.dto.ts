import { PartialType } from '@nestjs/mapped-types';
import { CreatePeliculaDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreatePeliculaDto) { }
