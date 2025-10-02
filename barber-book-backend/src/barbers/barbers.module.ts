import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { Barber } from './entities/barber.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Barber])], //Se importa el TypeORM
    controllers: [BarbersController],
    providers: [BarbersService],
    exports: [BarbersService] // Si otros módulos lo usarán
})
export class BarbersModule {}