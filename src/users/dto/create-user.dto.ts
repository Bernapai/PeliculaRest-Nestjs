
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'juan123',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
        example: 'mypassword123',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({
        description: 'Rol del usuario',
        enum: UserRole,
        example: UserRole.USER,
    })
    @IsEnum(UserRole, { message: 'El rol debe ser "admin" o "user"' })
    role: UserRole;
}
