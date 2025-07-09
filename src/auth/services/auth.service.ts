import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: loginDto) {
    const { name, password } = loginDto;
    const user = await this.usersService.findByName(name);
    const isPasswordValid = await bcrypt.compare(password, user?.password || '');

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }



  async register({ name, password }: RegisterDto) {
    const existingUser = await this.usersService.findByName(name);

    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.usersService.register({
      name,
      password: hashedPassword,
      role: UserRole.USER
    });

  }


}
