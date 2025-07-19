import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@/users/entities/user.entity';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRole, { message: 'El rol debe ser "admin" o "user"' })
    role: UserRole;
}
