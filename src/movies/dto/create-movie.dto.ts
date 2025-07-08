
import { IsString, IsOptional, IsInt, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePeliculaDto {
    @ApiProperty({ example: 'El Señor de los Anillos', maxLength: 255 })
    @IsString()
    @MaxLength(255)
    titulo: string;

    @ApiPropertyOptional({ example: 'Una aventura épica en la Tierra Media' })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ example: 2001, minimum: 1800 })
    @IsInt()
    @Min(1800)
    anio: number;

    @ApiPropertyOptional({ example: 'Fantasía', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    genero?: string;

    @ApiProperty({ example: 8.7, minimum: 0 })
    @IsNumber()
    @Min(0)
    calificacion: number;
}
