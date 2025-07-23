import { IsString, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class AuthResponse {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT de acceso' })
    @IsString({ message: 'El token debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El token de acceso es requerido' })
    access_token: string;

    @ApiProperty({ type: () => RegisterDto, description: 'Datos del usuario autenticado' })
    @IsObject({ message: 'El usuario debe ser un objeto válido' })
    @ValidateNested({ message: 'El usuario debe tener una estructura válida' })
    @Type(() => RegisterDto)
    usuario: RegisterDto;
}
