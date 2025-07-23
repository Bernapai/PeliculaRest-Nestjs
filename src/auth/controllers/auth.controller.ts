import { Body, Controller, Post } from '@nestjs/common';
import { loginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { AuthResponse } from '../dtos/authResponse.dto';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: loginDto })
    @ApiResponse({ status: 200, description: 'User logged in', type: AuthResponse })
    async login(@Body() loginDto: loginDto): Promise<AuthResponse> {
        return await this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User registered', type: User })
    async register(@Body() registerDto: RegisterDto): Promise<User> {
        return await this.authService.register(registerDto);
    }
}
