import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(correo: string, contraseña: string) {
    const user = await this.usersService.findByEmail(correo);

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user.id, rol: user.rol };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }

  async getUserById(id: number) {
    return this.usersService.findOne(id);
  }
}
