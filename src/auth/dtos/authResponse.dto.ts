// dtos/authResponse.dto.ts
import { IsString, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export class AuthResponse {
    @IsString({ message: 'El token debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El token de acceso es requerido' })
    access_token: string;

    @IsObject({ message: 'El usuario debe ser un objeto válido' })
    @ValidateNested({ message: 'El usuario debe tener una estructura válida' })
    @Type(() => User)
    usuario: User;
}