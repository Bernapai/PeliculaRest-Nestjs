import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
    @ApiProperty({ example: 'juan123', description: 'Nombre del usuario' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'miPasswordSegura', description: 'Contraseña del usuario' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
