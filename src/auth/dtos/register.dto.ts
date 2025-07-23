import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
    @ApiProperty({ example: 'juan123', description: 'Nombre del usuario' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'miPasswordSegura', description: 'Contraseña del usuario' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ enum: UserRole, description: 'Rol del usuario (admin o user)' })
    @IsEnum(UserRole, { message: 'El rol debe ser "admin" o "user"' })
    role: UserRole;
}
