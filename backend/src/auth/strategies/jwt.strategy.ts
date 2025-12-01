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
    // payload = { sub: user.id, rol: user.rol }
    const user = await this.authService.getUserById(payload.sub);

    if (!user) throw new UnauthorizedException('Token inválido');

    return {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
    };
  }
}
