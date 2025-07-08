import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from '../entities/movie.entity';
import { CreatePeliculaDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Pelicula)
        private readonly peliculaRepository: Repository<Pelicula>,
    ) { }

    async findAll(): Promise<Pelicula[]> {
        return this.peliculaRepository.find();
    }

    async findOne(id: number): Promise<Pelicula> {
        const pelicula = await this.peliculaRepository.findOneBy({ id })
        if (!pelicula) {
            throw new Error('Pelicula No encontradda')
        }
        return pelicula
    }

    async create(createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
        const pelicula = this.peliculaRepository.create(createPeliculaDto);
        return this.peliculaRepository.save(pelicula);
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Pelicula> {
        await this.peliculaRepository.update(id, updateMovieDto);
        const pelicula = await this.peliculaRepository.findOneBy({ id });
        if (!pelicula) {
            throw new Error(`Pelicula with id ${id} not found`);
        }
        return pelicula;
    }

    async remove(id: number): Promise<void> {
        await this.peliculaRepository.delete(id);
    }
}