import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], //Se importa el TypeORM
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService] // Si otros módulos lo usarán
})
export class UsersModule {}
