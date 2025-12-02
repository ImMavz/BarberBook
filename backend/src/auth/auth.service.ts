import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from 'src/barbers/barber.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(Barber)
    private readonly barberRepo: Repository<Barber>,
  ) {}

  async login(correo: string, contraseña: string) {
    const user = await this.usersService.findByEmail(correo);

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) throw new UnauthorizedException('Contraseña incorrecta');

    // 🔥 Buscar si el usuario es barbero
    const barbero = await this.barberRepo.findOne({
      where: { usuario: { id: user.id } },
      relations: ['barberia'],
    });

    const payload = {
      sub: user.id,
      rol: user.rol,
      barberoId: barbero?.id || null,
      barbershopId: barbero?.barberia?.id || null,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,

        // 🔥 Lo que el front necesita
        barberoId: barbero?.id || null,
        barbershopId: barbero?.barberia?.id || null,
      },
    };
  }

  async getUserById(id: number) {
    return this.usersService.findOne(id);
  }
}
