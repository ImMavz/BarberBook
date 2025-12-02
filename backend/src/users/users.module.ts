import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Barber } from 'src/barbers/barber.entity';
import { BarbersModule } from 'src/barbers/barbers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Barber]), // 👈 IMPORTANTE
    BarbersModule, // 👈 AÑADE ESTO
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
