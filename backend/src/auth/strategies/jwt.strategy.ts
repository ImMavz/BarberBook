import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecreto123',
    });
  }

async validate(payload: any) {
  const user = await this.authService.getUserById(payload.sub);

  if (!user) throw new UnauthorizedException('Token inválido');

  return {
    sub: user.id, // NECESARIO PARA QUE funcione /barbers/me
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    barberoId: payload.barberoId,
    barbershopId: payload.barbershopId,
    barbershopName: payload.barbershopName,
  };
  }
}
