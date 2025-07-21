import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { AuthResponse } from '../dtos/authResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: loginDto): Promise<AuthResponse> {
    const { name, password } = loginDto;
    const usuario = await this.usersService.findByName(name);
    const isPasswordValid = await bcrypt.compare(password, usuario?.password || '');

    if (!usuario || !isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, name: usuario.name, role: usuario.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token, usuario }
  }



  async register(registerDto: RegisterDto): Promise<User> {
    const { name, password, role } = registerDto;
    const existingUser = await this.usersService.findByName(name);

    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.usersService.register({
      name,
      password: hashedPassword,
      role,
    });

  }


}
