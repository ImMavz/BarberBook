import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from 'src/barbers/barber.entity';
import { BarbersModule } from 'src/barbers/barbers.module';

@Module({
  imports: [
    UsersModule,
    BarbersModule, // 👈 NECESARIO para relación y lógica de barberos
    TypeOrmModule.forFeature([Barber]), // 👈 NECESARIO para inyectar barberRepo

    JwtModule.register({
      secret: 'supersecreto123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
