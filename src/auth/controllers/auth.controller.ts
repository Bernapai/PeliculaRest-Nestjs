import { Controller, Post } from '@nestjs/common';
import { loginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponse } from '../dtos/authResponse.dto';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(loginDto: loginDto): Promise<AuthResponse> {
        return await this.authService.login(loginDto);
    }

    @Post('register')
    async register(registerDto: RegisterDto): Promise<User> {
        return await this.authService.register(registerDto);
    }
}
